import type { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const POST = async (req: Request) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get("stripe-signature") as string,
            env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        if (error! instanceof Error) {
            console.log(error);
        }
        console.log(`Webhook error: ${errorMessage}`);
        return NextResponse.json(
            { message: `Webhook error: ${errorMessage}` },
            { status: 400 },
        );
    }

    console.log("Success:", event.id);

    const permittedEvents: string[] = [
        "checkout.session.completed",
        "payment_intent.payment_failed",
        "refund.created",
    ];

    if (permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    data = event.data.object as Stripe.Checkout.Session;

                    const transactionId = data.payment_intent as string;
                    const amountPaid = data.amount_total;

                    const bookingId = data.metadata?.bookingId;
                    const reservationId = data.metadata?.reservationId;

                    if (!bookingId || !reservationId) {
                        throw new Error(
                            "Reservation ID and booking ID is required",
                        );
                    }

                    const reservation = await prisma.reservation.findUnique({
                        where: {
                            id: reservationId,
                        },
                        select: {
                            userId: true,
                            user: {
                                select: { email: true },
                            },
                            listing: {
                                select: {
                                    userId: true,
                                    title: true,
                                },
                            },
                        },
                    });

                    const [, booking] = await Promise.all([
                        prisma.reservation.update({
                            where: {
                                id: reservationId,
                            },
                            data: {
                                status: "CONFIRMED",
                            },
                        }),
                        prisma.booking.update({
                            where: {
                                id: bookingId,
                            },
                            data: {
                                transactionId,
                                amountPaid: amountPaid ? amountPaid / 100 : 0,
                                status: "PAID",
                            },
                        }),
                    ]);

                    if (reservation) {
                        const htmlPaymentSuccess = `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #28a745;">
                                <h2 style="color: #28a745;">Thanh toán thành công!</h2>
                                <p>Chúc mừng bạn! Chuyến đi đến <strong>${reservation.listing.title}</strong> đã được xác nhận.</p>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <p style="margin: 5px 0;"><strong>Mã giao dịch:</strong> ${booking.transactionId}</p>
                                    <p style="margin: 5px 0;"><strong>Số tiền đã thanh:</strong> ${booking.amountPaid} ${booking.currency}</p>
                                    <p style="margin: 5px 0;"><strong>Trạng thái:</strong> Đã xác nhận (CONFIRMED)</p>
                                </div>
                                <p>Bạn có thể xem chi tiết chuyến đi và thông tin liên lạc của chủ nhà tại đây:</p>
                                <a href="${env.APP_URL}/trips" 
                                    style="display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                    Xem chuyến đi của tôi
                                </a>
                            </div>
                        `;

                        await Promise.all([
                            inngest.send({
                                name: "tenant/stripe-event",
                                data: {
                                    userId: reservation.userId,
                                    message: "Payment successful",
                                },
                            }),
                            inngest.send({
                                name: "landlord/stripe-event",
                                data: {
                                    userId: reservation.listing.userId,
                                    message:
                                        "More people have made reservations",
                                },
                            }),
                            inngest.send({
                                name: "job/send-email",
                                data: {
                                    email: reservation.user.email,
                                    subject: "Payment successful",
                                    html: htmlPaymentSuccess,
                                },
                            }),
                        ]);
                    }

                    break;
                }
                case "payment_intent.payment_failed": {
                    data = event.data.object as Stripe.PaymentIntent;

                    const errorMessage = data.last_payment_error?.message;
                    const bookingId = data.metadata?.bookingId;
                    const reservationId = data.metadata?.reservationId;

                    if (!bookingId || !reservationId) {
                        throw new Error(
                            "Reservation ID and booking ID is required",
                        );
                    }

                    const reservation = await prisma.reservation.findUnique({
                        where: {
                            id: reservationId,
                        },
                        select: {
                            userId: true,
                            listing: {
                                select: {
                                    userId: true,
                                },
                            },
                        },
                    });

                    await Promise.all([
                        prisma.reservation.update({
                            where: {
                                id: reservationId,
                            },
                            data: {
                                status: "FAILED",
                            },
                        }),
                        prisma.booking.update({
                            where: {
                                id: bookingId,
                            },
                            data: {
                                status: "FAILED",
                                errorMessage: errorMessage
                                    ? errorMessage
                                    : null,
                            },
                        }),
                    ]);

                    if (reservation) {
                        await Promise.all([
                            inngest.send({
                                name: "tenant/stripe-event",
                                data: {
                                    userId: reservation.userId,
                                    message: "Payment failed",
                                },
                            }),
                        ]);
                    }

                    break;
                }
                case "refund.created": {
                    data = event.data.object as Stripe.Refund;
                    const paymentIntentId = data.payment_intent;

                    if (!paymentIntentId) {
                        throw new Error("Payment intent ID is required");
                    }

                    const booking = await prisma.booking.findUnique({
                        where: {
                            transactionId: paymentIntentId as string,
                        },
                    });

                    if (!booking) {
                        throw new Error("Booking not found");
                    }

                    if (!booking.reservationId) {
                        throw new Error("Reservation not found");
                    }

                    if (booking.status !== "REFUNDED") {
                        await prisma.$transaction([
                            prisma.reservation.deleteMany({
                                where: {
                                    id: booking.reservationId,
                                },
                            }),
                            prisma.booking.update({
                                where: {
                                    id: booking.id,
                                },
                                data: {
                                    status: "REFUNDED",
                                },
                            }),
                        ]);
                    }

                    const reservation = await prisma.reservation.findUnique({
                        where: {
                            id: booking.reservationId,
                        },
                        select: {
                            userId: true,
                            user: {
                                select: { email: true },
                            },
                            listing: {
                                select: {
                                    userId: true,
                                    title: true,
                                },
                            },
                        },
                    });

                    if (reservation) {
                        const htmlRefundSuccess = `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #17a2b8;">
                                <h2 style="color: #17a2b8;">Hoàn tiền thành công</h2>
                                <p>Yêu cầu hoàn tiền cho chuyến đi <strong>${reservation.listing.title}</strong> đã được xử lý thành công.</p>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <p style="margin: 5px 0;"><strong>Số tiền hoàn lại:</strong> ${booking.amountPaid} ${booking.currency}</p>
                                    <p style="margin: 5px 0;"><strong>Phương thức:</strong> Hoàn về thẻ đã thanh toán</p>
                                </div>
                                <p style="color: #6c757d; font-size: 14px;">
                                    <i>*Lưu ý: Tiền thường sẽ xuất hiện trong tài khoản của bạn sau 5 đến 10 ngày làm việc tùy thuộc vào ngân hàng.</i>
                                </p>
                                <a href="${env.APP_URL}/listings" 
                                    style="display: inline-block; background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                    Khám phá các chuyến đi khác
                                </a>
                            </div>
                        `;

                        await Promise.all([
                            inngest.send({
                                name: "tenant/stripe-event",
                                data: {
                                    userId: reservation.userId,
                                    message:
                                        "Your refund request has been processed. Please check your email for details",
                                },
                            }),
                            inngest.send({
                                name: "landlord/stripe-event",
                                data: {
                                    userId: reservation.listing.userId,
                                    message: "The refund process is complete",
                                },
                            }),
                            inngest.send({
                                name: "job/send-email",
                                data: {
                                    email: reservation.user.email,
                                    subject: "Refund successful",
                                    html: htmlRefundSuccess,
                                },
                            }),
                        ]);
                    }
                }
                default:
                    console.log("Unhandled event type: " + event.type);
                    break;
            }
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { message: "Webhook handler failed" },
                { status: 500 },
            );
        }
    }

    return NextResponse.json({ message: "Received" }, { status: 200 });
};

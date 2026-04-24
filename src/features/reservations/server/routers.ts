import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";
import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { reservationCreateSchema } from "../schemas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import { env } from "@/lib/env";
import { differenceInDays, format } from "date-fns";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { CheckoutMetadata } from "@/types/metadata";
import { inngest } from "@/inngest/client";

export const reservationRouter = new Elysia({
    prefix: "/reservations",
    name: "reservation-router",
})
    .use(authMacro)
    .post(
        "/refund/:reservationId",
        async ({ user, params: { reservationId }, body: { role } }) => {
            const reservation = await prisma.reservation.findFirst({
                where: {
                    id: reservationId,
                    OR: [
                        {
                            userId: user.id,
                        },
                        {
                            listing: {
                                userId: user.id,
                            },
                        },
                    ],
                },
                select: {
                    booking: {
                        select: {
                            id: true,
                            status: true,
                            transactionId: true,
                            currency: true,
                            amountPaid: true,
                        },
                    },
                    listing: {
                        select: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                            title: true,
                        },
                    },
                    id: true,
                    status: true,
                },
            });

            if (!reservation || reservation.status !== "CONFIRMED") {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            if (!reservation.booking || reservation.booking.status !== "PAID") {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            let message = "";

            if (role === "customer") {
                const htmlContent = `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ffcc00;">
                    <h2 style="color: #d4a017;">Yêu cầu huỷ chuyến đi và hoàn tiền</h2>
                    <p>Khách hàng <b>"${user.email}"</b> muốn huỷ chuyến đi đến <strong>${reservation.listing.title}</strong> và hoàn lại toàn bộ số tiền tương ứng là <strong>${reservation.booking.amountPaid}${reservation.booking.currency}</strong>.</p>
                    <a href="${env.APP_URL}/reservations" 
                        style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Xem chi tiết
                    </a>
                    </div>
                `;

                await inngest.send({
                    name: "job/send-email",
                    data: {
                        from: user.email,
                        email: reservation.listing.user.email,
                        subject: "Cancel and refund trips",
                        html: htmlContent,
                        replyTo: user.email,
                    },
                });

                await inngest.send({
                    name: "landlord/stripe-event",
                    data: {
                        userId: reservation.listing.user.email,
                        message: "There is a new refund request",
                    },
                });

                message = "The request has been sent";
            } else if (role === "vendor") {
                if (!reservation.booking.transactionId) {
                    throw new BusinessError(
                        "Forbidden",
                        403,
                        ErrorCode.FORBIDDEN,
                    );
                }
                await stripe.refunds.create({
                    payment_intent: reservation.booking.transactionId,
                });

                message = "Refund created";
            }

            return {
                message,
                role,
            };
        },
        {
            isAuth: true,
            params: t.Object({
                reservationId: t.String(),
            }),
            body: t.Object({
                role: t.Union([t.Literal("customer"), t.Literal("vendor")]),
            }),
        },
    )
    .post(
        "/booking/:reservationId",
        async ({ user, params: { reservationId } }) => {
            const reservation = await prisma.reservation.findFirst({
                where: {
                    id: reservationId,
                    userId: user.id,
                },
                include: {
                    listing: {
                        select: { title: true, price: true },
                    },
                },
            });

            if (!reservation) {
                throw new BusinessError(
                    "Reservation not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            if (reservation.status === "CONFIRMED") {
                throw new BusinessError(
                    "Booking existing",
                    409,
                    ErrorCode.CONFLICT,
                );
            }

            const booking = await prisma.booking.findUnique({
                where: {
                    reservationId: reservation.id,
                },
                select: {
                    currency: true,
                    id: true,
                    status: true,
                },
            });

            if (!booking) {
                throw new BusinessError(
                    "Booking not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            const totalDayRent = differenceInDays(
                reservation.endDate,
                reservation.startDate,
            );

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
                {
                    quantity: 1,
                    price_data: {
                        currency: booking.currency,
                        product_data: {
                            name: `Rent ${reservation.listing.title} (${totalDayRent} x ${reservation.listing.price}${booking.currency} / night)`,
                            description: `From ${format(reservation.startDate, "MMMM dd")} to ${format(reservation.endDate, "MMMM dd")}`,
                        },
                        unit_amount: Math.round(reservation.totalPrice * 100),
                    },
                },
            ];

            let stripeCustomer = await prisma.stripeCustomer.findUnique({
                where: {
                    userId: user.id,
                },
                select: {
                    stripeCustomerId: true,
                },
            });

            if (!stripeCustomer) {
                const customer = await stripe.customers.create({
                    email: user.email,
                });

                stripeCustomer = await prisma.stripeCustomer.create({
                    data: {
                        userId: user.id,
                        stripeCustomerId: customer.id,
                    },
                });
            }

            const checkout = await stripe.checkout.sessions.create({
                customer: stripeCustomer.stripeCustomerId,
                success_url: `${env.APP_URL}/trips?success=true`,
                cancel_url: `${env.APP_URL}/trips?cancel=true`,
                mode: "payment",
                line_items: line_items,
                invoice_creation: {
                    enabled: true,
                },
                payment_intent_data: {
                    metadata: {
                        bookingId: booking.id,
                        reservationId: reservation.id,
                    } as CheckoutMetadata,
                },
                metadata: {
                    bookingId: booking.id,
                    reservationId: reservation.id,
                } as CheckoutMetadata,
            });

            if (!checkout.url) {
                throw new BusinessError(
                    "Failed to create checkout session",
                    500,
                    ErrorCode.INTERNAL_SERVER_ERROR,
                );
            }

            await prisma.notification.create({
                data: {
                    ownerId: user.id,
                    title: "Payment new event",
                    content: "Booking checkout session created",
                },
            });

            return {
                url: checkout.url,
            };
        },
        {
            isAuth: true,
            params: t.Object({
                reservationId: t.String(),
            }),
        },
    )
    .delete(
        "/:reservationId",
        async ({ user, params: { reservationId } }) => {
            const canceledReservation = await prisma.reservation.findFirst({
                where: {
                    id: reservationId,
                    OR: [{ userId: user.id }, { listing: { userId: user.id } }],
                },
            });

            if (!canceledReservation) {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            if (canceledReservation.status === "CONFIRMED") {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            await Promise.all([
                prisma.reservation.delete({
                    where: {
                        id: reservationId,
                    },
                }),
                prisma.booking.update({
                    where: {
                        reservationId: canceledReservation.id,
                    },
                    data: {
                        status: "CANCELLED",
                    },
                }),
                prisma.notification.create({
                    data: {
                        ownerId: user.id,
                        title: "Cancel reservation",
                        content: "You cancel a reservation",
                    },
                }),
            ]);

            return canceledReservation;
        },
        {
            isAuth: true,
            params: t.Object({
                reservationId: t.String(),
            }),
        },
    )
    .get(
        "/",
        async ({ query: { listingId, queryType }, request: { headers } }) => {
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (
                (queryType === "by_user" || queryType === "by_author") &&
                !userId
            ) {
                throw new BusinessError(
                    "Unauthorized",
                    401,
                    ErrorCode.UNAUTHORIZED,
                );
            }

            if (queryType === "by_listing" && !listingId) {
                throw new BusinessError(
                    "Listing not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            const query: Prisma.ReservationWhereInput = {};

            if (listingId && queryType === "by_listing") {
                query.listingId = listingId;
            }

            if (userId && queryType === "by_user") {
                query.userId = userId;
            }

            if (userId && queryType === "by_author") {
                query.listing = { userId };
            }

            const reservations = await prisma.reservation.findMany({
                where: query,
                include: {
                    listing: {
                        include: {
                            favorites: userId ? { where: { userId } } : false,
                            _count: {
                                select: { favorites: true },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return reservations;
        },
        {
            query: t.Object({
                listingId: t.Optional(t.String()),
                queryType: t.Union([
                    t.Literal("by_listing"),
                    t.Literal("by_user"),
                    t.Literal("by_author"),
                ]),
            }),
        },
    )
    .post(
        "/",
        async ({
            user,
            body: { totalPrice, startDate, endDate, listingId },
        }) => {
            const existingListing = await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
                select: {
                    userId: true,
                },
            });

            if (!existingListing) {
                throw new BusinessError(
                    "Listing not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            const isOwnListing = existingListing.userId === user.id;

            if (isOwnListing) {
                throw new BusinessError(
                    "You cannot book your own listing",
                    400,
                    ErrorCode.BAD_REQUEST,
                );
            }

            const createdReservation = await prisma.$transaction(async (tx) => {
                const conflict = await tx.reservation.findFirst({
                    where: {
                        listingId,
                        AND: [
                            { startDate: { lte: endDate } },
                            { endDate: { gte: startDate } },
                        ],
                    },
                });

                if (conflict) {
                    throw new BusinessError(
                        "Date already booked",
                        409,
                        ErrorCode.CONFLICT,
                    );
                }

                return await prisma.reservation.create({
                    data: {
                        userId: user.id,
                        listingId,
                        totalPrice,
                        startDate,
                        endDate,
                    },
                });
            });

            if (createdReservation) {
                await Promise.all([
                    prisma.booking.create({
                        data: {
                            userId: user.id,
                            reservationId: createdReservation.id,
                        },
                    }),
                    prisma.notification.create({
                        data: {
                            ownerId: user.id,
                            title: "Booking reservation",
                            content: "You booking new reservation",
                        },
                    }),
                ]);
            }

            return createdReservation;
        },
        {
            isAuth: true,
            body: reservationCreateSchema,
        },
    );

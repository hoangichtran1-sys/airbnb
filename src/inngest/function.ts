import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { stripeEvent } from "./channels/stripe-event-channel";
import { sendEmail, SendMailProps } from "@/utils/send-mail";
import { prisma } from "@/lib/prisma";
import { subDays, subWeeks, subMonths, startOfMonth } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { env } from "@/lib/env";

const emailRevenueTemplate = (
    userEmail: string,
    amount: number,
    month: string,
) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Báo Cáo Doanh Thu Tháng ${month}</h2>
    <p>Xin chào <strong>${userEmail}</strong>,</p>
    <p>Dưới đây là tóm tắt doanh thu từ các bài đăng cho thuê của bạn trong tháng vừa qua:</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <span style="font-size: 18px;">Tổng doanh thu:</span><br/>
      <strong style="font-size: 32px; color: #27ae60;">${formatPrice(amount)}</strong>
    </div>

    <p>Bạn có thể đăng nhập vào hệ thống để xem chi tiết từng đơn đặt phòng.</p>
    <a href="${env.APP_URL}/reservations" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Truy cập Dashboard</a>
    
    <p style="margin-top: 30px; font-size: 12px; color: #888;">Cảm ơn bạn đã đồng hành cùng chúng tôi!<br/>Đội ngũ hỗ trợ khách hàng.</p>
  </div>
`;

export const tenantStripeEvent = inngest.createFunction(
    {
        id: "tenant-stripe-event",
        triggers: [{ event: "tenant/stripe-event" }],
        retries: 3,
    },
    async ({ event, step }) => {
        const { userId, message } = event.data as {
            userId: string;
            message?: string;
        };

        if (!userId) {
            throw new NonRetriableError("User ID is missing");
        }

        await step.run("add-new-notification", async () => {
            await prisma.notification.create({
                data: {
                    ownerId: userId,
                    title: "Payment new event",
                    content: message,
                },
            });
        });

        const channel = stripeEvent(userId);

        await step.realtime.publish("status-completed", channel.status, {
            message,
            step: "completed",
        });
    },
);

export const landlordStripeEvent = inngest.createFunction(
    {
        id: "landlord-stripe-event",
        triggers: [{ event: "landlord/stripe-event" }],
        retries: 3,
    },
    async ({ event, step }) => {
        const { userId, message } = event.data as {
            userId: string;
            message?: string;
        };

        if (!userId) {
            throw new NonRetriableError("User ID is missing");
        }

        await step.run("add-new-notification", async () => {
            await prisma.notification.create({
                data: {
                    ownerId: userId,
                    title: "Payment new event",
                    content: message,
                },
            });
        });

        const channel = stripeEvent(userId);

        await step.realtime.publish("status-completed", channel.status, {
            message,
            step: "completed",
        });
    },
);

export const sendEmailJob = inngest.createFunction(
    {
        id: "send-email-job",
        triggers: [{ event: "job/send-email" }],
        retries: 3,
    },
    async ({ event, step }) => {
        const { from, email, subject, html, replyTo } =
            event.data as SendMailProps;

        if (!email || !subject || !html) {
            throw new NonRetriableError("Missing field required");
        }

        const infoSendMail = await step.run("send-mail", async () => {
            const info = await sendEmail({
                from,
                email,
                subject,
                html,
                replyTo,
            });

            return info;
        });

        console.log(infoSendMail.messageId);
    },
);

export const changeReservationStatus = inngest.createFunction(
    {
        id: "change-reservation-status",
        triggers: { cron: "TZ=Asia/Ho_Chi_Minh 0 1 * * *" },
    },
    async ({ step }) => {
        const oneDayAgo = subDays(new Date(), 1);

        const reservationsChange = await step.run(
            "get-reservation-change",
            async () => {
                const reservations = await prisma.reservation.findMany({
                    where: {
                        status: "PENDING",
                        createdAt: { lt: oneDayAgo },
                    },
                });

                return reservations;
            },
        );

        if (reservationsChange.length > 0) {
            await step.run("add-notification-user", async () => {
                await Promise.all(
                    reservationsChange.map((reservation) =>
                        prisma.notification.create({
                            data: {
                                ownerId: reservation.userId,
                                title: "Change failed reservation",
                                content: `My reservation with ${reservation.totalPrice} USD booking change failed`,
                            },
                        }),
                    ),
                );
            });

            await step.run("reservation-change-status", async () => {
                const result = await prisma.reservation.updateMany({
                    where: {
                        status: "PENDING",
                        createdAt: { lt: oneDayAgo },
                    },
                    data: {
                        status: "FAILED",
                    },
                });

                return {
                    changedCount: result.count,
                    message: `Changed ${result.count} reservations`,
                };
            });
        } else {
            console.log("No reservation change");
        }
    },
);

export const removeReservationFailed = inngest.createFunction(
    {
        id: "remove-reservation-failed",
        triggers: { cron: "TZ=Asia/Ho_Chi_Minh 0 0 * * 1" },
    },
    async ({ step }) => {
        await step.run("remove-reservation-failed", async () => {
            const result = await prisma.reservation.deleteMany({
                where: {
                    status: "FAILED",
                },
            });

            return {
                deletedCount: result.count,
                message: `Deleted ${result.count} reservations`,
            };
        });
    },
);

export const removeNotificationOld = inngest.createFunction(
    {
        id: "remove-notification-old",
        triggers: { cron: "TZ=Asia/Ho_Chi_Minh 0 0 * * 0" },
    },
    async ({ step }) => {
        await step.run("remove-notification-old", async () => {
            const oneWeekAgo = subWeeks(new Date(), 1);

            const result = await prisma.notification.deleteMany({
                where: {
                    status: "READ",
                    createdAt: { lt: oneWeekAgo },
                },
            });

            return {
                deletedCount: result.count,
                message: `Deleted ${result.count} old notifications`,
            };
        });
    },
);

export const revenueUsersMonthly = inngest.createFunction(
    {
        id: "revenue-users-monthly",
        triggers: { cron: "TZ=Asia/Ho_Chi_Minh 0 9 1 * *" },
    },
    async ({ step }) => {
        const userRevenues = await step.run(
            "calculate-user-revenue",
            async () => {
                const users = await prisma.user.findMany({
                    include: {
                        listings: {
                            include: {
                                reservations: {
                                    where: {
                                        status: "CONFIRMED",
                                        createdAt: {
                                            gte: startOfMonth(
                                                subMonths(new Date(), 1),
                                            ),
                                            lte: startOfMonth(new Date()),
                                        },
                                    },
                                    select: { totalPrice: true },
                                },
                            },
                        },
                    },
                });

                return users.map((user) => {
                    const totalRevenue = user.listings.reduce(
                        (accListing, listing) => {
                            const listingRevenue = listing.reservations.reduce(
                                (accRes, res) => accRes + (res.totalPrice || 0),
                                0,
                            );
                            return accListing + listingRevenue;
                        },
                        0,
                    );

                    return {
                        userId: user.id,
                        email: user.email,
                        totalRevenue,
                    };
                });
            },
        );

        await step.run("send-revenue-emails", async () => {
            const monthYear =
                new Date().getMonth() === 0
                    ? "12"
                    : new Date().getMonth().toString();

            const emailPromises = userRevenues
                .filter((user) => user.totalRevenue > 0)
                .map((user) => {
                    return sendEmail({
                        email: user.email,
                        subject: `💰 Báo cáo doanh thu tháng ${monthYear}`,
                        html: emailRevenueTemplate(
                            user.email,
                            user.totalRevenue,
                            monthYear,
                        ),
                    });
                });

            return await Promise.all(emailPromises);
        });
    },
);

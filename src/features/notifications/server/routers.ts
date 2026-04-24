import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { prisma } from "@/lib/prisma";
import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";

export const notificationRouter = new Elysia({
    prefix: "/notifications",
    name: "notification-router",
})
    .use(authMacro)
    .get(
        "/",
        async ({ user }) => {
            const notifications = await prisma.notification.findMany({
                where: {
                    ownerId: user.id,
                },
                orderBy: [
                    {
                        status: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
            });

            return notifications;
        },
        {
            isAuth: true,
        },
    )
    .put(
        "/:notificationId",
        async ({ user, params: { notificationId } }) => {
            const notification = await prisma.notification.findUnique({
                where: {
                    id: notificationId,
                },
            });

            if (!notification) {
                throw new BusinessError(
                    "Notification not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            if (notification.ownerId !== user.id) {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            const notificationUpdated = await prisma.notification.update({
                where: {
                    id: notificationId,
                },
                data: {
                    status: "READ",
                },
            });

            return notificationUpdated;
        },
        {
            isAuth: true,
            params: t.Object({
                notificationId: t.String(),
            }),
        },
    )
    .delete(
        "/:notificationId",
        async ({ user, params: { notificationId } }) => {
            const notification = await prisma.notification.findUnique({
                where: {
                    id: notificationId,
                },
            });

            if (!notification) {
                throw new BusinessError(
                    "Notification not found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            if (notification.ownerId !== user.id) {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            const notificationDeleted = await prisma.notification.delete({
                where: {
                    id: notificationId,
                },
            });

            return notificationDeleted;
        },
        {
            isAuth: true,
            params: t.Object({
                notificationId: t.String(),
            }),
        },
    )
    .post(
        "/bulk-delete",
        async ({ user, body: { notificationIds } }) => {
            const bulkDeleted = await prisma.notification.deleteMany({
                where: {
                    id: {
                        in: notificationIds,
                    },
                    ownerId: user.id,
                },
            });

            if (bulkDeleted.count !== notificationIds.length) {
                throw new BusinessError(
                    "Bad request",
                    400,
                    ErrorCode.BAD_REQUEST,
                );
            }

            return { count: bulkDeleted.count };
        },
        {
            isAuth: true,
            body: t.Object({
                notificationIds: t.Array(t.String()),
            }),
        },
    )
    .post(
        "/bulk-update",
        async ({ user, body: { notificationIds } }) => {
            const bulkUpdated = await prisma.notification.updateMany({
                where: {
                    id: {
                        in: notificationIds,
                    },
                    ownerId: user.id,
                },
                data: {
                    status: "READ",
                },
            });

            if (bulkUpdated.count !== notificationIds.length) {
                throw new BusinessError(
                    "Bad request",
                    400,
                    ErrorCode.BAD_REQUEST,
                );
            }

            return { count: bulkUpdated.count };
        },
        {
            isAuth: true,
            body: t.Object({
                notificationIds: t.Array(t.String()),
            }),
        },
    );

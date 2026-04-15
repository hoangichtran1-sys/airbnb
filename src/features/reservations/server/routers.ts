import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";
import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { reservationCreateSchema } from "../schemas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

export const reservationRouter = new Elysia({
    prefix: "/reservations",
    name: "reservation-router",
})
    .use(authMacro)
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

            await prisma.reservation.delete({
                where: {
                    id: reservationId,
                },
            });

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

            return createdReservation;
        },
        {
            isAuth: true,
            body: reservationCreateSchema,
        },
    );

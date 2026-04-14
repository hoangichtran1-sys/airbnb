import { prisma } from "@/lib/prisma";
import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";
import { listingCreateSchema } from "../schemas";
import { auth } from "@/lib/auth";
import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { Prisma } from "@/generated/prisma/client";
import { sortMap, sortValues } from "@/types/sort-type";

export const listingRouter = new Elysia({
    prefix: "/listings",
    name: "listing-router",
})
    .use(authMacro)
    .get(
        "/:listingId",
        async ({ params: { listingId }, request: { headers } }) => {
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            const listing = await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
                include: {
                    favorites: userId ? { where: { userId } } : false,
                    user: true,
                },
            });

            if (!listing) {
                throw new BusinessError(
                    "Not listing found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            return listing;
        },
        {
            params: t.Object({
                listingId: t.String(),
            }),
        },
    )
    .get(
        "/favorite",
        async ({ user }) => {
            const listingsFavorite = await prisma.listing.findMany({
                where: {
                    favorites: {
                        some: {
                            userId: user.id,
                        },
                    },
                },
                include: {
                    favorites: { where: { userId: user.id } },
                    _count: {
                        select: { favorites: true },
                    },
                },
            });

            return listingsFavorite;
        },
        {
            isAuth: true,
        },
    )
    .post(
        "/rent",
        async ({ body, user }) => {
            const createdListing = await prisma.listing.create({
                data: {
                    userId: user.id,
                    category: body.category,
                    locationValue: body.location,
                    guestCount: body.guestCount,
                    roomCount: body.roomCount,
                    bathroomCount: body.bathroomCount,
                    imageUrl: body.imageUrl,
                    title: body.title,
                    description: body.description,
                    price: body.price,
                },
            });

            return createdListing;
        },
        {
            isAuth: true,
            body: listingCreateSchema,
        },
    )
    .delete(
        "/:listingId",
        async ({ user, params: { listingId }, status }) => {
            const ownListing = await prisma.listing.findFirst({
                where: {
                    id: listingId,
                    userId: user.id,
                },
            });

            if (!ownListing) {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            await prisma.listing.delete({
                where: { id: listingId },
            });

            return status(204);
        },
        { isAuth: true, params: t.Object({ listingId: t.String() }) },
    )
    .get(
        "/",
        async ({ query, request: { headers } }) => {
            const {
                category,
                guestCount,
                roomCount,
                bathroomCount,
                locationValue,
                startDate,
                endDate,
                queryType,
                sort,
            } = query;

            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if ((startDate && !endDate) || (!startDate && endDate)) {
                throw new BusinessError(
                    "Invalid date range",
                    400,
                    ErrorCode.BAD_REQUEST,
                );
            }

            if (startDate && endDate && startDate > endDate) {
                throw new BusinessError(
                    "Start date must be before end date",
                    400,
                    ErrorCode.BAD_REQUEST,
                );
            }

            const queryListings: Prisma.ListingWhereInput = {};

            if (category) {
                queryListings.category = category;
            }

            if (userId && queryType === "by_user") {
                queryListings.userId = userId;
            }

            if (guestCount) {
                queryListings.guestCount = { gte: guestCount };
            }

            if (roomCount) {
                queryListings.roomCount = { gte: roomCount };
            }

            if (bathroomCount) {
                queryListings.bathroomCount = { gte: bathroomCount };
            }

            if (locationValue) {
                queryListings.locationValue = locationValue;
            }

            if (startDate && endDate) {
                queryListings.reservations = {
                    none: {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate },
                    },
                };
            }

            const listings = await prisma.listing.findMany({
                where: queryListings,
                include: {
                    favorites: userId
                        ? {
                              where: {
                                  userId,
                              },
                          }
                        : false,
                    _count: {
                        select: { favorites: true },
                    },
                },
                orderBy: sort ? sortMap[sort] : sortMap["newest"],
            });

            return listings;
        },
        {
            query: t.Object({
                category: t.Optional(t.String()),
                guestCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                roomCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                bathroomCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                locationValue: t.Optional(t.Union([t.String(), t.Null()])),
                startDate: t.Optional(t.Union([t.Date(), t.Null()])),
                endDate: t.Optional(t.Union([t.Date(), t.Null()])),
                sort: t.Optional(
                    t.Union([
                        t.Literal("newest"),
                        t.Literal("popular"),
                        t.Literal("most_booked"),
                        t.Literal("price_low"),
                        t.Literal("price_high"),
                    ]),
                ),
                queryType: t.Union([t.Literal("all"), t.Literal("by_user")]),
            }),
        },
    );

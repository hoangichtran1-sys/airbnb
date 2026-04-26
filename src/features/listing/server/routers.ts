import { prisma } from "@/lib/prisma";
import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";
import { listingCreateSchema } from "../schemas";
import { auth } from "@/lib/auth";
import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { Prisma } from "@/generated/prisma/client";
import { sortMap } from "@/types/sort-type";
import { MAX_LIMIT, MIN_LIMIT, PAGINATION } from "@/constant";

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
                    favorites: true,
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
                    bedroomCount: body.bedroomCount,
                    imageUrl: body.imageUrl,
                    title: body.title,
                    description: body.description,
                    price: body.price,
                },
            });

            if (createdListing) {
                await prisma.notification.create({
                    data: {
                        title: "Add my listing",
                        content: "You add new listing",
                        ownerId: user.id,
                    },
                });
            }

            return createdListing;
        },
        {
            isAuth: true,
            body: listingCreateSchema,
        },
    )
    .delete(
        "/:listingId",
        async ({ user, params: { listingId } }) => {
            const ownListing = await prisma.listing.findFirst({
                where: {
                    id: listingId,
                    userId: user.id,
                },
            });

            if (!ownListing) {
                throw new BusinessError("Forbidden", 403, ErrorCode.FORBIDDEN);
            }

            const listingDeleted = await prisma.listing.delete({
                where: { id: listingId },
            });

            await prisma.notification.create({
                data: {
                    title: "Remove my listing",
                    content: "You remove new listing",
                    ownerId: user.id,
                },
            });

            return listingDeleted;
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
                bedroomCount,
                locationValue,
                startDate,
                endDate,
                sort,
                cursor,
                limit,
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

            if (guestCount) {
                queryListings.guestCount = { gte: guestCount };
            }

            if (roomCount) {
                queryListings.roomCount = { gte: roomCount };
            }

            if (bathroomCount) {
                queryListings.bathroomCount = { gte: bathroomCount };
            }

            if (bedroomCount) {
                queryListings.bedroomCount = { gte: bedroomCount };
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

            const data = await prisma.listing.findMany({
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
                take: limit ? limit + 1 : undefined,
                ...(cursor && {
                    cursor: { id: cursor.id },
                    skip: 1,
                }),
            });

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.id,
                  }
                : null;

            return { items, nextCursor };
        },
        {
            query: t.Object({
                category: t.Optional(t.String()),
                guestCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                roomCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                bathroomCount: t.Optional(t.Union([t.Integer(), t.Null()])),
                bedroomCount: t.Optional(t.Union([t.Integer(), t.Null()])),
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
                cursor: t.Optional(
                    t.Union([
                        t.Object({
                            id: t.String(),
                        }),
                        t.Null(),
                    ]),
                ),
                limit: t.Integer({ minimum: MIN_LIMIT, maximum: MAX_LIMIT }),
            }),
        },
    )
    .get(
        "/by-owner",
        async ({ user, query: { page, pageSize } }) => {
            const [items, totalCount] = await Promise.all([
                prisma.listing.findMany({
                    where: {
                        userId: user.id,
                    },
                    include: {
                        favorites: {
                            where: {
                                userId: user.id,
                            },
                        },
                        _count: {
                            select: { favorites: true },
                        },
                    },
                    orderBy: [{ createdAt: "desc" }],
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                }),
                prisma.listing.count({
                    where: {
                        userId: user.id,
                    },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            };
        },
        {
            isAuth: true,
            query: t.Object({
                page: t.Integer({ default: PAGINATION.DEFAULT_PAGE }),
                pageSize: t.Integer({
                    minimum: PAGINATION.MIN_PAGE_SIZE,
                    maximum: PAGINATION.MAX_PAGE_SIZE,
                    default: PAGINATION.DEFAULT_PAGE_SIZE,
                }),
            }),
        },
    )
    .get("/search-with-title", async () => {
        const listings = await prisma.listing.findMany({
            select: {
                id: true,
                imageUrl: true,
                title: true,
                locationValue: true,
                category: true,
            },
        });

        return listings;
    });

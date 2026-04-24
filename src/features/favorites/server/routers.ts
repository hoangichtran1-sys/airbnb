import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { prisma } from "@/lib/prisma";
import { authMacro } from "@/plugins/auth-macro";
import { Elysia, t } from "elysia";

export const favoriteRouter = new Elysia({
    prefix: "/favorites",
    name: "favorite-router",
})
    .use(authMacro)
    .post(
        "/add-listing",
        async ({ user, body }) => {
            const { listingId } = body;

            const existingFavorite = await prisma.favorite.findUnique({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId,
                    },
                },
            });

            if (existingFavorite) {
                throw new BusinessError(
                    "Already in favorites",
                    409,
                    ErrorCode.CONFLICT,
                );
            }

            const addedFavorite = await prisma.favorite.create({
                data: {
                    userId: user.id,
                    listingId,
                },
            });

            if (addedFavorite) {
                await prisma.notification.create({
                    data: {
                        title: "Add new favorite",
                        content: "You add new favorite",
                        ownerId: user.id,
                    },
                });
            }

            return addedFavorite;
        },
        {
            isAuth: true,
            body: t.Object({
                listingId: t.String(),
            }),
        },
    )
    .post(
        "/remove-listing",
        async ({ user, body }) => {
            const { listingId } = body;

            const existingFavorite = await prisma.favorite.findUnique({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId,
                    },
                },
            });

            if (!existingFavorite) {
                throw new BusinessError(
                    "Not favorite found",
                    404,
                    ErrorCode.NOT_FOUND,
                );
            }

            const removedFavorite = await prisma.favorite.delete({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId,
                    },
                },
            });

            if (removedFavorite) {
                await prisma.notification.create({
                    data: {
                        title: "Remove favorite",
                        content: "You remove favorite",
                        ownerId: user.id,
                    },
                });
            }

            return removedFavorite;
        },
        {
            isAuth: true,
            body: t.Object({
                listingId: t.String(),
            }),
        },
    );

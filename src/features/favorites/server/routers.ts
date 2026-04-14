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

            return removedFavorite;
        },
        {
            isAuth: true,
            body: t.Object({
                listingId: t.String(),
            }),
        },
    );

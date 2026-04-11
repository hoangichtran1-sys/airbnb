import { prisma } from "@/lib/prisma";
import { authMacro } from "@/plugins/auth-macro";
import { Elysia } from "elysia";
import { listingCreateSchema } from "../types";

export const listingRouter = new Elysia({
    prefix: "/listings",
    name: "listing-router",
})
    .use(authMacro)
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
    .get(
        "/",
        async ({ user }) => {
            const listings = await prisma.listing.findMany({
                where: {
                    userId: user.id,
                },
            });

            return listings;
        },
        {
            isAuth: true,
        },
    );

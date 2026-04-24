"use server";

import { prisma } from "@/lib/prisma";

export async function getListings() {
    const listings = await prisma.listing.findMany({
        select: {
            id: true,
            imageUrl: true,
            title: true,
            locationValue: true,
            category: true,
        }
    });

    return listings;
}
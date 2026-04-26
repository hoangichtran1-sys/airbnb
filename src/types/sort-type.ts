import { Prisma } from "@/generated/prisma/client";

export const LISTINGS_SORT = {
    NEWEST: "newest",
    POPULAR: "popular",
    MOST_BOOKED: "most_booked",
    PRICE_LOW: "price_low",
    PRICE_HIGH: "price_high",
} as const;

export const sortValues = Object.values(LISTINGS_SORT);

export type ListingsSort = (typeof LISTINGS_SORT)[keyof typeof LISTINGS_SORT];

export const sortMap = {
    newest: [{ createdAt: "desc" }, { id: "desc" }],
    popular: [{ favorites: { _count: "desc" } }, { id: "desc" }],
    most_booked: [{ reservations: { _count: "desc" } }, { id: "desc" }],
    price_low: [{ price: "asc" }, { id: "desc" }],
    price_high: [{ price: "desc" }, { id: "desc" }],
} as const satisfies Record<
    ListingsSort,
    Prisma.ListingOrderByWithRelationInput[]
>;

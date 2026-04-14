export const QUERY_RESERVATIONS = {
    BY_LISTING: "by_listing",
    BY_USER: "by_user",
    BY_AUTHOR: "by_author",
} as const;

export type QueryReservations =
    (typeof QUERY_RESERVATIONS)[keyof typeof QUERY_RESERVATIONS];

export const Query_Listings = {
    ALL: "all",
    BY_USER: "by_user",
} as const;

export type QueryListings =
    (typeof Query_Listings)[keyof typeof Query_Listings];

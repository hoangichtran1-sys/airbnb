import { t } from "elysia";

export const reservationCreateSchema = t.Object({
    totalPrice: t.Number(),
    startDate: t.Date(),
    endDate: t.Date(),
    listingId: t.String(),
});

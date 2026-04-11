import { t } from "elysia";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
};

export const listingCreateSchema = t.Object({
    category: t.String({ minLength: 1 }),
    location: t.String({ minLength: 1 }),
    guestCount: t.Integer({ minimum: 1 }),
    roomCount: t.Integer({ minimum: 1 }),
    bathroomCount: t.Integer({ minimum: 1 }),
    imageUrl: t.String({ minLength: 1 }),
    title: t.String({ minLength: 1 }),
    description: t.String({ minLength: 1 }),
    price: t.Number({ minimum: 1 }),
});

import { t } from "elysia";
import { CountrySelectValue } from "./types";
import { z } from "zod"

export const listingCreateSchema = t.Object({
    category: t.String({ minLength: 1 }),
    location: t.String({ minLength: 1 }),
    guestCount: t.Integer({ minimum: 1 }),
    roomCount: t.Integer({ minimum: 1 }),
    bathroomCount: t.Integer({ minimum: 1 }),
    bedroomCount: t.Integer({ minimum: 1 }),
    imageUrl: t.String({ minLength: 1 }),
    title: t.String({ minLength: 1 }),
    description: t.String({ minLength: 1 }),
    price: t.Number({ minimum: 1 }),
});

export const rentSchema = z.object({
    category: z.string().min(1, "Category is required"),
    location: z.custom<CountrySelectValue>().nullable(),
    guestCount: z.number().int().min(1),
    roomCount: z.number().int().min(1),
    bathroomCount: z.number().int().min(1),
    bedroomCount: z.number().int().min(1),
    imageUrl: z.string().min(1, "Image URL is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(1),
});
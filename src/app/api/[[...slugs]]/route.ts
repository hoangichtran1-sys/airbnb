import { Elysia } from "elysia";
import { BusinessError } from "@/config/error";

import { favoriteRouter } from "@/features/favorites/server/routers";
import { listingRouter } from "@/features/listing/server/routers";
import { reservationRouter } from "@/features/reservations/server/routers";

const app = new Elysia({ prefix: "/api", name: "base-router" })
    .error({
        BUSINESS_ERROR: BusinessError,
    })
    .onError(({ code, error, status }) => {
        switch (code) {
            case "BUSINESS_ERROR":
                return status(error.status, {
                    message: error.message,
                    code: error.error_code,
                });
            case "VALIDATION":
                return status(422, {
                    message: error.message,
                    code: "VALIDATE_FIELDS_ERROR",
                });
            default:
                return status(500, {
                    message: "Something went wrong",
                    code: "INTERNAL_SERVER_ERROR",
                });
        }
    })
    .use(listingRouter)
    .use(favoriteRouter)
    .use(reservationRouter);

export const GET = app.fetch;
export const POST = app.fetch;
export const PATCH = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;

// .model({
//     "res.error": t.Object({
//         message: t.String({ minLength: 1 }),
//         code: t.Enum(ErrorCode),
//     }),
// })

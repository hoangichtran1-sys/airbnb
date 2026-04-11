import { BusinessError } from "@/config/error";
import { listingRouter } from "@/features/listing/server/routers";
import { Elysia } from "elysia";

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
            default:
                throw error;
        }
    })
    .use(listingRouter)
    .get("/health", () => {
        return { status: "ok" };
    });

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

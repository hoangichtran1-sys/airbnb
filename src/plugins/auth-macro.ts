import { BusinessError } from "@/config/error";
import { ErrorCode } from "@/enums/error-code";
import { auth } from "@/lib/auth";
import { Elysia } from "elysia";

export const authMacro = new Elysia({ name: "auth-macro" }).macro({
    isAuth: {
        resolve: async ({ request: { headers } }) => {
            const sessionData = await auth.api.getSession({
                headers,
            });

            if (!sessionData) {
                throw new BusinessError(
                    "Unauthorized",
                    401,
                    ErrorCode.UNAUTHORIZED,
                );
            }

            return {
                user: sessionData.user,
                session: sessionData.session,
            };
        },
    },
});

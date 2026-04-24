import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";

export const auth = betterAuth({
    appName: "Airbnb",
    baseURL: env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        maxPasswordLength: 100,
        autoSignIn: true,
    },
    socialProviders: {
        facebook: {
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        twitter: {
            clientId: env.TWITTER_CLIENT_ID,
            clientSecret: env.TWITTER_CLIENT_SECRET,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false, // Recommend
            trustedProviders: ["google", "email-password", "facebook", "twitter"],
        },
    },
    advanced: {
        cookiePrefix: "airbnb-app",
    },
    user: {
        additionalFields: {
            lang: {
                type: "string",
                required: false,
                input: true,
                defaultValue: "en",
            },
        },
    },
    //trustedOrigins: [env.APP_URL],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

import { realtime } from "inngest";
import { z } from "zod";

export const stripeEvent = realtime.channel({
    name: (userId: string) => `stripe-event:${userId}`,
    topics: {
        status: {
            schema: z.object({
                message: z.string().optional(),
                step: z.string().optional(),
            }),
        },
        tokens: {
            schema: z.object({ token: z.string(), step: z.string() }),
        },
    },
});

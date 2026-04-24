"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripeEvent } from "../channels/stripe-event-channel";

export async function stripeEventToken(userId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    return getClientSubscriptionToken(inngest, {
        channel: stripeEvent(userId),
        topics: ["status", "tokens"],
    });
}

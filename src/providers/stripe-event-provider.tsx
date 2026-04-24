"use client";

import { stripeEventToken } from "@/inngest/actions/stripe-event-token";
import { STRIPE_EVENT } from "@/inngest/channels/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "inngest/react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface StripeEventProviderProps {
    userId: string;
}

export const StripeEventProvider = ({ userId }: StripeEventProviderProps) => {
    const topics = ["status", "tokens"] as const;
    const channel = STRIPE_EVENT(userId);

    const lastProcessedKey = useRef<string | null>(null);

    const queryClient = useQueryClient();

    const getToken = useCallback(() => {
        return stripeEventToken(userId);
    }, [userId]);

    const { messages } = useRealtime({
        channel,
        topics,
        token: getToken,
    });

    useEffect(() => {
        const lastMessage = messages.last;

        if (lastMessage && lastMessage.topic === "status") {
            const { message, step } = lastMessage.data as {
                message?: string;
                step?: string;
            };

            const runId = lastMessage.runId || "";

            const currentKey = `${runId}-${step}`;

            if (currentKey === lastProcessedKey.current) {
                return;
            }

            lastProcessedKey.current = currentKey;

            if (step === "completed") {
                if (message) {
                    toast.dismiss();
                    toast.success(message, {
                        id: `stripe-event-${userId}`,
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["reservations"] });
            } else if (step === "failed") {
                if (message) {
                    toast.error(message, { id: `stripe-event-${userId}` });
                }
            }
        }
    }, [messages.last, userId, queryClient]);

    return null;
};

import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import {
    tenantStripeEvent,
    landlordStripeEvent,
    sendEmailJob,
    changeReservationStatus,
    removeNotificationOld,
    removeReservationFailed,
    revenueUsersMonthly,
} from "@/inngest/function";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        /* your functions will be passed here later! */
        tenantStripeEvent,
        landlordStripeEvent,
        sendEmailJob,
        changeReservationStatus,
        removeNotificationOld,
        removeReservationFailed,
        revenueUsersMonthly,
    ],
});

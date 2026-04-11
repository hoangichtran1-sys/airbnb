import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }
    return session;
};

export const requireUnauth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }
};

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    // const { data } = await authClient.getSession()
    // console.log(data ? data.user : null)
    if (!session || !session.user) {
        return null;
    }

    return session.user;
};

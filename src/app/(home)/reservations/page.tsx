import { requireAuth } from "@/lib/auth-utils";
import { Client } from "./client";

const Page = async () => {
    await requireAuth();

    return <Client />;
};

export default Page;

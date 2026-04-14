import { Client } from "./client";

interface PageProps {
    params: Promise<{
        listingId: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { listingId } = await params;

    return <Client listingId={listingId} />;
};

export default Page;

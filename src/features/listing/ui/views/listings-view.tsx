"use client";

import { useGetListings } from "../../api/use-get-listings";

export const ListingsView = () => {
    const { data, error, isError, isLoading } = useGetListings();

    if (isLoading) return <p>Loading...</p>;

    if (isError) return <p>{error.message}</p>;

    return (
        <div>
            Listings
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

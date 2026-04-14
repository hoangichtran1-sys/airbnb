import { Container } from "@/components/container";
import { ResponseType as FavoritesResponse } from "../../api/use-get-listings-favorite";
import { Heading } from "@/components/heading";
import { ListingCard } from "@/features/listing/ui/components/listing-card";

interface FavoritesViewProps {
    listingsFavorite: FavoritesResponse;
}

export const FavoritesView = ({ listingsFavorite }: FavoritesViewProps) => {
    return (
        <Container>
            <Heading
                title="Favorites"
                subtitle="List of place you have favorited!"
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 ">
                {listingsFavorite.map((listing) => (
                    <ListingCard key={listing.id} data={listing} />
                ))}
            </div>
        </Container>
    );
};

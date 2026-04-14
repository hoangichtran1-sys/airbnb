import { Heading } from "@/components/heading";
import { useCountries } from "../../hooks/use-countries";
import Image from "next/image";
import { HeartButton } from "@/features/favorites/ui/components/heart-button";

interface ListingHeadProps {
    title: string;
    imageUrl: string;
    locationValue: string;
    id: string;
    isFavorited: boolean;
}

export const ListingHead = ({
    title,
    imageUrl,
    locationValue,
    id,
    isFavorited,
}: ListingHeadProps) => {
    const { getByValue } = useCountries();

    const location = getByValue(locationValue);

    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <Image
                    alt={title}
                    src={imageUrl}
                    fill
                    className="object-cover w-full"
                    loading="eager"
                />
                <div className="absolute top-5 right-5">
                    <HeartButton listingId={id} isFavorited={isFavorited} />
                </div>
            </div>
        </>
    );
};

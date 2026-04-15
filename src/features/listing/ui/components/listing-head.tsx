import { Heading } from "@/components/heading";
import { useCountries } from "../../hooks/use-countries";
import Image from "next/image";
import { HeartButton } from "@/features/favorites/ui/components/heart-button";
import { Skeleton } from "@/components/ui/skeleton";

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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-5 right-5">
                    <HeartButton listingId={id} isFavorited={isFavorited} />
                </div>
            </div>
        </>
    );
};

export const ListingHeaderSkeleton = () => {
    return (
        <>
            {/* HEADING */}
            <div className="space-y-2 mb-4">
                <Skeleton className="h-8 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
            </div>

            {/* IMAGE */}
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <Skeleton className="w-full h-full" />

                {/* Heart button */}
                <div className="absolute top-5 right-5">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
        </>
    );
};

import { User } from "@/lib/auth";
import { IconType } from "react-icons";
import { useCountries } from "../../hooks/use-countries";
import { AvatarUser } from "@/components/avatar-user";
import { Separator } from "@/components/ui/separator";
import { ListingCategory } from "./listing-category";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Map = dynamic(() => import("../components/map").then((mod) => mod.Map), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-auto" />,
});

interface ListingInfoProps {
    user: User;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    bedroomCount: number;
    category:
        | {
              icon: IconType;
              label: string;
              description: string;
          }
        | undefined;
    locationValue: string;
}

export const ListingInfo = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    bedroomCount,
    category,
    locationValue,
}: ListingInfoProps) => {
    const { getByValue } = useCountries();
    const coordinates = getByValue(locationValue)?.latlng;

    return (
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                    <p>Hosted by {user.name}</p>
                    <AvatarUser user={user} />
                </div>
                <div className="flex flex-row it gap-4 font-light text-neutral-500">
                    <p>
                        {guestCount} {guestCount === 1 ? "guest" : "guests"}
                    </p>
                    <p>
                        {roomCount} {roomCount === 1 ? "room" : "rooms"}
                    </p>
                    <p>
                        {bathroomCount}{" "}
                        {bathroomCount === 1 ? "bathroom" : "bathrooms"}
                    </p>
                     <p>
                        {bedroomCount}{" "}
                        {bedroomCount === 1 ? "bedroom" : "bedrooms"}
                    </p>
                </div>
            </div>
            <Separator />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <Separator />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <Separator />
            <Map center={coordinates} />
        </div>
    );
};

export const ListingInfoSkeleton = () => {
    return (
        <div className="col-span-4 flex flex-col gap-8">
            {/* HOST */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-50" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* META */}
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-25" />
                </div>
            </div>

            <Separator />

            {/* CATEGORY */}
            <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-37.5" />
                    <Skeleton className="h-4 w-62.5" />
                </div>
            </div>

            <Separator />

            {/* DESCRIPTION */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
            </div>

            <Separator />

            {/* MAP */}
            <Skeleton className="w-full h-75 rounded-xl" />
        </div>
    );
};

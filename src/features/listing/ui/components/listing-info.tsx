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

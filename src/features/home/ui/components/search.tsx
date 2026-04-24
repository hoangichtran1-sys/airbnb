"use client";

import { useCountries } from "@/features/listing/hooks/use-countries";
import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { useSearchModal } from "@/features/search/hooks/use-rent-modal";
import { BiSearch } from "react-icons/bi";
import { differenceInDays } from "date-fns";
import { useMemo, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CircleXIcon,
    EllipsisVerticalIcon,
    ScanSearchIcon,
} from "lucide-react";
import { SearchWithTitle } from "./search-with-title";

export const Search = () => {
    const { onOpenSearchModal } = useSearchModal();
    const [openSearchTitle, setOpenSearchTitle] = useState(false);

    const [searchValues, setSearchValues] = useListingsSearch();

    const { getByValue } = useCountries();

    const locationLabel = useMemo(() => {
        if (searchValues.locationValue) {
            return getByValue(searchValues.locationValue)?.label as string;
        }

        return "Anywhere";
    }, [searchValues.locationValue, getByValue]);

    const durationLabel = useMemo(() => {
        if (searchValues.startDate && searchValues.endDate) {
            const start = searchValues.startDate;
            const end = searchValues.endDate;
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} ${diff === 1 ? "Day" : "Days"}`;
        }

        return "Any Week";
    }, [searchValues.startDate, searchValues.endDate]);

    const onClearSearch = () => {
        setSearchValues({
            locationValue: null,
            guestCount: null,
            roomCount: null,
            bathroomCount: null,
            bedroomCount: null,
            startDate: null,
            endDate: null,
        });
    };

    return (
        <>
            <SearchWithTitle
                open={openSearchTitle}
                onOpenChange={setOpenSearchTitle}
            />
            <div
                onClick={onOpenSearchModal}
                className="relative border w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-sm transition cursor-pointer"
            >
                <div className="flex flex-row items-center justify-between">
                    <div className="text-sm font-semibold px-6">
                        {locationLabel}
                    </div>
                    <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center">
                        {durationLabel}
                    </div>
                    <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                        <div className="hidden sm:block">
                            {searchValues.guestCount
                                ? searchValues.guestCount
                                : "Add Guests"}
                        </div>
                        <div className="p-2 bg-rose-500  rounded-full text-white">
                            <BiSearch size={18} />
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/3 -right-6 hidden md:block">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVerticalIcon className="size-4 text-neutral-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={(e) => {
                               e.stopPropagation();
                               setOpenSearchTitle(true);
                            }}
                            >
                                <ScanSearchIcon />
                                Search with title
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onClearSearch();
                            }}>
                                <CircleXIcon />
                                Clear search
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};

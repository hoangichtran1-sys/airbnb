import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import { useGetListingsSearchWithTitle } from "@/features/listing/api/use-get-listings-search-with-title";
import { useCountries } from "@/features/listing/hooks/use-countries";
import { getIconWithCategory } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";

interface SearchWithTitleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SearchWithTitle = ({
    open,
    onOpenChange,
}: SearchWithTitleProps) => {
    const { data } = useGetListingsSearchWithTitle();
    const { getByValue } = useCountries();

    const listingsData = data || [];

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <Command className="min-h-75">
                <CommandInput placeholder="Search with title..." />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-neutral-500 italic">
                            No listings found.
                        </span>
                    </CommandEmpty>
                    <CommandGroup heading="Listings">
                        {listingsData.map((listing) => {
                            const Icon = getIconWithCategory(listing.category);
                            const location = getByValue(listing.locationValue);

                            return (
                                <CommandItem
                                    onSelect={() =>
                                        window.open(
                                            `/listings/${listing.id}`,
                                            "_blank",
                                        )
                                    }
                                    key={listing.id}
                                    className="cursor-pointer"
                                >
                                    <Icon />
                                    <span>{listing.title}</span>
                                    {"   "}
                                    <span className="text-xs text-muted-foreground">
                                        {location?.region}, {location?.label}
                                    </span>
                                    <CommandShortcut>
                                        <ExternalLinkIcon />
                                    </CommandShortcut>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
};

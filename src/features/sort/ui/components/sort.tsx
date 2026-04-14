"use client";

import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { snakeCaseToTitle } from "@/lib/utils";
import { ListingsSort, sortValues } from "@/types/sort-type";
import { useListingsSort } from "../../hooks/use-listings-sort";
import { VscSortPrecedence } from "react-icons/vsc";
import { Hint } from "@/components/hint";

export const Sort = () => {
    const [sortValue, setSortValue] = useListingsSort();

    return (
        <DropdownMenu>
            <Hint text="Sort">
                <DropdownMenuTrigger asChild>
                    <VscSortPrecedence className="size-8 cursor-pointer text-neutral-600 hover:text-neutral-800" />
                </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-semibold text-muted-foreground">Sort options</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={sortValue.sort}
                        onValueChange={(value) =>
                            setSortValue({ sort: value as ListingsSort })
                        }
                    >
                        {sortValues.map((value) => (
                            <DropdownMenuRadioItem className="font-semibold" key={value} value={value}>
                                {snakeCaseToTitle(value)}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

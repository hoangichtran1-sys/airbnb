"use client";

import { useListingsSearch } from "@/features/search/hooks/use-listings-search";
import { Heading } from "./heading";
import { Button } from "./ui/button";
import { useCategoriesFilter } from "@/features/categories/hooks/use-categories-filter";
import { useListingsSort } from "@/features/sort/hooks/use-listings-sort";

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

export const EmptyState = ({
    title = "No exact matches",
    subtitle = "Try changing or removing some of your filters",
    showReset,
}: EmptyStateProps) => {
    const [, setFilterCategories] = useCategoriesFilter();
    const [, setSearchValues] = useListingsSearch();
    const [, setSortValue] = useListingsSort();

    const onClear = () => {
        setFilterCategories({ category: "" });
        setSearchValues({
            locationValue: null,
            startDate: null,
            endDate: null,
            guestCount: null,
            roomCount: null,
            bathroomCount: null,
        });
        setSortValue({ sort: null });
    };

    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading title={title} subtitle={subtitle} center />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        variant="outline"
                        onClick={onClear}
                    >
                        Remove all filters
                    </Button>
                )}
            </div>
        </div>
    );
};

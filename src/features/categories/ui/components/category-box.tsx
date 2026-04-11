import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { useCategoriesFilter } from "../../hooks/use-categories-filter";

interface CategoryBoxProps {
    label: string;
    icon: IconType;
    selected?: boolean;
}

export const CategoryBox = ({
    label,
    icon: Icon,
    selected,
}: CategoryBoxProps) => {
    const [, setFilter] = useCategoriesFilter();

    return (
        <div
            onClick={() => setFilter(label)}
            className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer",
                selected
                    ? "border-b-neutral-800 text-neutral-800"
                    : "border-transparent text-neutral-500",
            )}
        >
            <Icon size={26} />
            <div className="font-medium text-sm">{label}</div>
        </div>
    );
};

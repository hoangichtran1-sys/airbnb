import { cn } from "@/lib/utils";
import { IconType } from "react-icons"

interface CategoryInputProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    onSelect: (value: string) => void;
}

export const CategoryInput = ({
    icon: Icon,
    label,
    selected,
    onSelect
}: CategoryInputProps) => {
    return (
        <div onClick={() => onSelect(label)} className={cn(
            "rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer",
            selected ? "border-black" : "border-neutral-200"
        )}>
            <Icon size={30} />
            <div className="font-semibold">
                {label}
            </div>
        </div>
    )
}
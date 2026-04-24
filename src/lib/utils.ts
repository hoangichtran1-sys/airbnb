import { categories } from "@/features/categories/ui/components/category-list";
import { clsx, type ClassValue } from "clsx";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { TbLocationFilled } from "react-icons/tb";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

export function snakeCaseToTitle(str: string) {
    return str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getIconWithCategory(categoryLabel: string): IconType {
    const category = categories.find((item) => item.label === categoryLabel);

    return category?.icon || TbLocationFilled;
}

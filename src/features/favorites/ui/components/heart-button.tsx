"use client";

import { useAddFavorite } from "@/features/favorites/api/use-add-favorite";
import { useRemoveFavorite } from "@/features/favorites/api/use-remove-favorite";
import { cn } from "@/lib/utils";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
    isFavorited: boolean;
    listingId: string;
}

export const HeartButton = ({ isFavorited, listingId }: HeartButtonProps) => {
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    console.log(isFavorited);
    const toggleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (isFavorited) {
            removeFavorite.mutate({ listingId });
        } else {
            addFavorite.mutate({ listingId });
        }
    };

    return (
        <div
            onClick={toggleFavorite}
            className="relative hover:opacity-80 transition cursor-pointer"
        >
            <AiOutlineHeart
                size={28}
                className="fill-white absolute -top-0.5 -right-0.5"
            />
            <AiFillHeart
                size={24}
                className={cn(
                    isFavorited ? "fill-rose-500" : "fill-neutral-500/70",
                )}
            />
        </div>
    );
};

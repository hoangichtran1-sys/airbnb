"use client";

import { Container } from "@/components/container";

import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
    GiWindmill,
    GiIsland,
    GiBoatFishing,
    GiCastle,
    GiForestCamp,
    GiCaveEntrance,
    GiCactus,
    GiBarn,
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { LuGrape } from "react-icons/lu";
import { IoDiamond } from "react-icons/io5";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { CategoryBox } from "./category-box";
import { usePathname } from "next/navigation";
import { useCategoriesFilter } from "../../hooks/use-categories-filter";
import { Sort } from "@/features/sort/ui/components/sort";

export const categories = [
    {
        label: "Beach",
        icon: TbBeach,
        description: "This property is close to the beach!",
    },
    {
        label: "Windmills",
        icon: GiWindmill,
        description: "This property has windmills!",
    },
    {
        label: "Modern",
        icon: MdOutlineVilla,
        description: "This property is modern!",
    },
    {
        label: "Country",
        icon: TbMountain,
        description: "This property is in the countryside!",
    },
    {
        label: "Pools",
        icon: TbPool,
        description: "This property has a pool!",
    },
    {
        label: "Islands",
        icon: GiIsland,
        description: "This property is on an island!",
    },
    {
        label: "Skiing",
        icon: FaSkiing,
        description: "This property has skiing activities!",
    },
    {
        label: "Lake",
        icon: GiBoatFishing,
        description: "This property is close to a lake!",
    },
    {
        label: "Castles",
        icon: GiCastle,
        description: "This property is in a castle!",
    },
    {
        label: "Camping",
        icon: GiForestCamp,
        description: "This property has camping activities!",
    },
    {
        label: "Arctic",
        icon: BsSnow,
        description: "This property is in an arctic!",
    },
    {
        label: "Cave",
        icon: GiCaveEntrance,
        description: "This property is in a cave!",
    },
    {
        label: "Desert",
        icon: GiCactus,
        description: "This property is in the desert!",
    },
    {
        label: "Barns",
        icon: GiBarn,
        description: "This property is in the barn!",
    },
    {
        label: "Vineyards",
        icon: LuGrape,
        description: "This property is in a vineyard!",
    },
    {
        label: "Lux",
        icon: IoDiamond,
        description: "This property is luxurious!",
    },
];

export const CategoryList = () => {
    const pathname = usePathname();

    const [filterCategories] = useCategoriesFilter();

    const isMainPage = pathname === "/";

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                <CategoryBox
                    label="All"
                    icon={BiCategory}
                    selected={filterCategories.category === ""}
                />
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        selected={filterCategories.category === item.label}
                    />
                ))}
                <div className="gap-2">
                    <Sort />
                </div>
            </div>
        </Container>
    );
};

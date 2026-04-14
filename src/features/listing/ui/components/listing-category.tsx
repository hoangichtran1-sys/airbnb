import { IconType } from "react-icons"

interface ListingCategoryProps {
    icon: IconType;
    label: string;
    description: string;
}

export const ListingCategory = ({
    icon: Icon,
    label,
    description
}: ListingCategoryProps) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center gap-4">
                <Icon size={40} className="text-neutral-600" />
                <div className="text-lg font-semibold">
                    <p className="text-lg font-semibold">
                        {label}
                    </p>
                    <p className="text-neutral-500 font-light">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}
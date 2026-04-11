import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCountries } from "../../hooks/use-countries";

import "flag-icons/css/flag-icons.min.css";
import { CountrySelectValue } from "../../types";

interface CountrySelectProps {
    value?: CountrySelectValue | null;
    onChange: (value: CountrySelectValue) => void;
}

export const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
    const [open, setOpen] = React.useState(false);
    const { getAll } = useCountries();
    const countries = getAll();

    const selectedCountry = countries.find((c) => c.value === value?.value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-10 px-3"
                >
                    {selectedCountry ? (
                        <div className="flex items-center gap-2 truncate">
                            <span
                                className={`fi fi-${selectedCountry.value.toLowerCase()}`}
                            />
                            <span>{selectedCountry.label}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Anywhere</span>
                    )}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
            >
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList className="max-h-75 overflow-y-auto overflow-x-hidden">
                        <CommandEmpty>
                            <span className="text-neutral-500 italic">No country found.</span>
                        </CommandEmpty>
                        <CommandGroup>
                            {countries.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-2 py-3 cursor-pointer"
                                >
                                    <div className="flex flex-row items-center gap-3 w-full">
                                        <span
                                            className={`fi fi-${item.value.toLowerCase()} text-lg shadow-sm shrink-0`}
                                        />
                                        <div className="truncate">
                                            {item.label},
                                            <span className="text-neutral-500 ml-1">
                                                {item.region}
                                            </span>
                                        </div>
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-2 h-4 w-4 shrink-0",
                                            value?.value === item.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

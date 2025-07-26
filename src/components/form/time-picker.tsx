import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import Hook = flatpickr.Options.Hook;
import { ClockIcon } from "lucide-react";

type PropsType = {
    id: string;
    onChange?: Hook | Hook[];
    label?: string;
    placeholder?: string;
};

export default function DatePicker({
    id,
    onChange,
    label,
    placeholder,

}: PropsType) {


    return (
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <input
                    id={id}
                    type="time"
                    placeholder={placeholder}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                />

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ClockIcon className="size-6" />
                </span>
            </div>
        </div>
    );
}

import { useState } from "react";
import Select from "../../../components/form/Select";

type SelectOption = {
    value: string;
    label: string;
};

type AllocateActionsProps = {
    filters: {
        mode: string;
        module: string;
        term: string;
        class_: string;
        lecturer: string;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            mode: string;
            module: string;
            term: string;
            class_: string;
            lecturer: string;
        }>
    >;
};

export default function ReportActions({ filters, setFilters }: AllocateActionsProps) {
    const [modes] = useState<SelectOption[]>([
        { label: "Institution", value: "institution" },
        { label: "Department", value: "department" },
        { label: "Class", value: "class" },
        { label: "Lecturer", value: "lecturer" },
    ]);

    const handleSelectMode = (selected_id: string) => {
        const selectedOption = modes.find((m) => m.value === selected_id);
        setFilters({ ...filters, mode: selectedOption?.label || "" });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
            {/* Empty placeholders if you need spacing */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />

            {/* Responsive Select aligned to the right on lg screens */}
            <div className="w-full flex justify-start lg:justify-end">
                <Select
                    options={modes}
                    defaultValue="institution"
                    placeholder="Select Timetable"
                    onChange={(val) => handleSelectMode(val)}
                    className="w-full sm:w-64"
                />
            </div>
        </div>
    );
}

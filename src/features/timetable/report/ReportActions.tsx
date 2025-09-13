import { useEffect, useState } from "react";
import Select from "../../../components/form/Select";
import { fetchDropdownData } from "../../../utils/apiFetch";

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
        branch: string;
        lecturer: string;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            mode: string;
            branch: string;
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
    
    const [branches, setBranch] = useState<{ value: string; label: string; }[]>([]);

    useEffect(() => {
        const loadDropdowns = async () => {
          setBranch(await fetchDropdownData("/api/branches/?all=true"));
        };
    
        loadDropdowns();
    }, []);

    const handleSelectMode = (selected_id: string) => {
        const selectedOption = modes.find((m) => m.value === selected_id);
        setFilters({ ...filters, mode: selectedOption?.label || "" });
    };

    const handleSelectBranch = (selected: string) => {
        setFilters({ ...filters, branch: selected })
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center">
            {/* Empty placeholders if you need spacing */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />

            <div className="w-full">
                <Select
                    options={branches}
                    placeholder="Select Branch"
                    onChange={(val) => handleSelectBranch(val)}
                    className="w-full sm:w-64"
                />
            </div>

            {/* Responsive Select aligned to the right on lg screens */}
            <div className="w-full">
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

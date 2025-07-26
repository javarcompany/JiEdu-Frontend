import { useState } from "react";
import Select from "../../../components/form/Select";

type SelectOption = {
    value: string;
    label: string;
};

type AllocateActionsProps = {
    filters: { mode: string, module: string, term:string; class_: string, lecturer: string };
    setFilters: React.Dispatch<React.SetStateAction<{ mode: string, module: string, term:string; class_: string, lecturer: string }>>;
};

export default function ReportActions({ filters, setFilters }: AllocateActionsProps) {

    const [modes] = useState<SelectOption[]>([
        { label: "Fee Structure", value: "fee_structure" },
        { label: "Reciept", value: "reciept" },
        { label: "Transaction Log", value: "transaction_log" },
        { label: "Fee Statement", value: "fee_statement" },
    ]);

    const handleSelectMode = async (selected_id: string) => {
        const selectedOption = modes.find((m) => m.value === selected_id);
        console.log("Selected Mode:", selectedOption?.label)
        setFilters({ ...filters, mode:selectedOption?.label || "" });
    };

    return (
        <div className="grid grid-cols-4 gap-4 md:gap-6">
            
                <Select
                    options={modes}
                    defaultValue="Class"
                    placeholder = "Select Timetable"
                    onChange = {(val) => handleSelectMode(val)}
                />
                
        </div>
    )
};
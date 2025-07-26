import PageMeta from "../../../components/common/PageMeta";
import AllocateTable from "./AllocateTable";
import AllocateActions from "./AllocateActions";
import { useState } from "react";

export default function AllocateDashboard() {
    const [filters, setFilters] = useState({
        branch: "",
        course: "",
        module: "",
        class_: "",
        term: ""
    });
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // NEW

    return (
        <>
            <PageMeta
                title="JiEdu Students | Class Allocation Page"
                description="Students Page for JiEdu Application showing list of student's enrollment in the system"
            />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-3">
                    <AllocateActions 
                        filters={filters}
                        setFilters={setFilters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>
                <div className="col-span-12 xl:col-span-9">
                    <AllocateTable
                        filters={filters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>
            </div>
        </>
    );
}

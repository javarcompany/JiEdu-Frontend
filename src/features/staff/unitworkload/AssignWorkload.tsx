import PageMeta from "../../../components/common/PageMeta";
import AssignWorkloadTable from "./AssignWorkloadTable";
import AssignWorkloadActions from "./AssignWorkloadActions";
import { useState } from "react";

export default function AssignWorkload() {
    const [filters, setFilters] = useState({
        course: "",
        module: "",
        term: "",
        class_: "",
        lecturer: ""
    });
    const [selectedIds, setSelectedIds] = useState<string[]>([]); 
 
    return (
        <>
            <PageMeta
                title="JiEdu Staff | Unit Workload Page"
                description="Staff Page for JiEdu Application used to assign unit workload in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <AssignWorkloadActions 
                        filters={filters}
                        setFilters={setFilters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                    <AssignWorkloadTable 
                        filters={filters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>
            </div> 
        </>
    );
}
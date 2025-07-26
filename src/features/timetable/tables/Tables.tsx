import PageMeta from "../../../components/common/PageMeta";
import AddTable from "./AddTables";
import TablesActions from "./TablesActions";
import { useState } from "react";
import { SelectedIds } from "./AddTables";

export default function Tables() {
    const [filters, setFilters] = useState({
        branch: "",
        course: "",
        module: "",
        term: "",
        class_: "",
        day: ""
    });

    const [selectedIds, setSelectedIds] = useState<SelectedIds[]>([]);

    return (
        <>
            <PageMeta
                title="JiEdu Students | Class Allocation Page"
                description="Students Page for JiEdu Application showing list of student's enrollment in the system"
            />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-3">
                    <TablesActions 
                        filters={filters}
                        setFilters={setFilters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>
                <div className="col-span-12 xl:col-span-9">
                    <AddTable
                        filters={filters}
                        setFilters={setFilters}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div> 
            </div>
        </>
    );
}

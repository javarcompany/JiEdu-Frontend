import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ApproveActions from "./ApproveControls";
import ApproveTable from "./ApproveTable";

export default function ApproveDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // NEW

    return (
        <>
            <PageMeta
                title="JiEdu Students | Enrollment Page"
                description="Students Page for JiEdu Application showing list of student's enrollment in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 xl:col-span-3">
                    <ApproveActions
                        onSearch={setSearchTerm} 
                        selectedIds={selectedIds} 
                        setSelectedIds={setSelectedIds}
                    />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <ApproveTable 
                        searchTerm={searchTerm}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />
                </div>
            </div> 
        </>
    );
}
import PageMeta from "../../../components/common/PageMeta";
import StaffWorkloadTable from "./StaffWorkloadTable";
import StaffWorkloadAction from "./StaffWorkloadAction";
import { useState } from "react";

export default function StaffWorkload() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Staff | Workload Page"
                description="Workload Page for JiEdu Application showing list of staff's workload in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <StaffWorkloadTable searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-3">
                    <StaffWorkloadAction onSearch={setSearchTerm} />
                </div>
            </div> 
        </>
    );
}
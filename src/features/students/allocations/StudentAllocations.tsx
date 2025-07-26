import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import StudentAllocationActions from "./StudentAllocationActions";
import StudentAllocationTable from "./StudentAllocationTable";
import StudentClassCount from "./StudentClassCount";

export default function StudentAllocations() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Students | Class Allocation Page"
                description="Students Page for JiEdu Application showing list of student's class allocation in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-3">
                    <StudentAllocationActions onSearch={setSearchTerm} />
                    <StudentClassCount />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <StudentAllocationTable  searchTerm={searchTerm}  />
                </div>

            </div> 
        </>
    );
}
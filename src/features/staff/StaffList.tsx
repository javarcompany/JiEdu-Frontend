import PageMeta from "../../components/common/PageMeta";
import StaffTable from "./StaffListTable";
import StaffActions from "./StaffListAction";
import { useState } from "react";


export default function StaffList() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Students | Student List Page"
                description="Students Page for JiEdu Application showing list of students in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <StaffActions onSearch={setSearchTerm} />
                    <StaffTable searchTerm={searchTerm} />
                </div>
            </div> 
        </>
    );
}
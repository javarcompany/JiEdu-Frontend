import PageMeta from "../../components/common/PageMeta";
import DepartmentTable from "./DepartmentTable";
import DepartmentActions from "./DepartmentActions";

import { useState } from "react";

export default function DepartmentDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Department Page"
                description="Department Page for JiEdu Application showing departments of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-3">
                    <DepartmentActions onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <DepartmentTable searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}
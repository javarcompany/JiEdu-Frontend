import PageMeta from "../../components/common/PageMeta";
import ClassroomTable from "./ClassroomTable";
import ClassroomActions from "./ClassroomActions";

import { useState } from "react";

export default function ClassroomDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Classroom Page"
                description="Classroom Page for JiEdu Application showing classrooms of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-3">
                    <ClassroomActions onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-9">
                    <ClassroomTable searchTerm={searchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}
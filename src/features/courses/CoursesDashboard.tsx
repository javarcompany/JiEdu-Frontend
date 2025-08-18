import PageMeta from "../../components/common/PageMeta";
import CoursesTable from "./CoursesTable";
import CoursesActions from "./CoursesActions";

import { useState } from "react";

export default function CoursesDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [save, setSave] = useState<boolean>(true);
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Courses Page"
                description="Courses Page for JiEdu Application showing departments of the institution"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-9">
                    <CoursesTable saveValue = {save} searchTerm={searchTerm} />
                </div>
                
                <div className="col-span-12 xl:col-span-3">
                    <CoursesActions onSave={setSave} onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}
import PageMeta from "../../../components/common/PageMeta";
import ClassTutorActions from "./ClassTutorActions";
import ClassTutorTable from "./ClassTutorTable";
import { useState } from "react";

export default function ClassTutorDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Course Tutor Page"
                description="Course Tutor Page for JiEdu Application showing summary report of the system"
            />

            <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-12 xl:col-span-9">
                    <ClassTutorTable searchTerm={searchTerm}/>
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <ClassTutorActions onSearch={setSearchTerm} />
                </div>

                <div className="col-span-12 xl:col-span-12">
                    <div className="col-span-12 space-y-6 xl:col-span-12">

                    </div>
                </div>
            </div>           

        </>
    );
}
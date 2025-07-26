import PageMeta from "../../../components/common/PageMeta";
import StudentEnrollmentTable from "./StudentEnrollmentTable";
import StudentEnrollmentActions from "./StudentEnrollmentActions";
import { useState } from "react";

export default function StudentEnrollments() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Students | Enrollment Page"
                description="Students Page for JiEdu Application showing list of student's enrollment in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-9">
                    <StudentEnrollmentTable  searchTerm={searchTerm}/>
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-3">
                    <StudentEnrollmentActions onSearch={setSearchTerm}/>
                </div>
            </div> 
        </>
    );
}
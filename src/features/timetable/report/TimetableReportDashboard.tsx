import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import ReportActions from "./ReportActions";
import InstitutionTimetable from "./InstitutionTimetable";
import KlassTimetable from "./KlassTimetable";
import LecturerTimetable from "./LecturerTimetable";
import DepartmentTimetable from "./DepartmentTimetable";

export default function TimetableReportDashboard() {
    const [filters, setFilters] = useState({
        mode: "",
        module: "",
        term: "",
        class_: "",
        branch: "",
        lecturer: ""
    });

    useEffect(() => {
        setFilters({...filters, mode:"Institution"});
    }, []);
    
    return (
        <>
            <PageMeta
                title="JiEdu Timetable | Timetable Report Page"
                description="Timetable Page for JiEdu Application used to generate reports"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <ReportActions 
                        filters={filters}
                        setFilters={setFilters}
                    />

                    {filters.mode === "Institution" && (
                        <InstitutionTimetable branch={filters.branch}/>
                    )}

                    {filters.mode === "Department" && (
                        <DepartmentTimetable branch={filters.branch}/>
                    )}

                    {filters.mode === "Class" && (
                        <KlassTimetable branch={filters.branch} />
                    )}

                    {filters.mode === "Lecturer" && (
                        <LecturerTimetable branch={filters.branch}/>
                    )}

                </div>
            </div> 
        </>
    );
}
 
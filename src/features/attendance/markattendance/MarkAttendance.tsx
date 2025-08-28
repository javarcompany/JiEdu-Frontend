// MarkAttendance.tsx (Parent Component)
import PageMeta from "../../../components/common/PageMeta";
import MarkattendanceTable from "./MarkattendanceTable";
import MarkAttendanceActions from "./MarkAttendanceActions";
import MarkAttendanceFR from "./MarkAttendanceFR";
import { useState } from "react";

export default function MarkAttendance() {
    const [filters, setFilters] = useState({
        term: "",
        class_: "",
        mode: "",
        who: ""
    });
    const [status, setStatus] = useState<{ [key: string]: string }>({});
    const [selectedMode, setSelectedMode] = useState<{ id: string, label: string }>({ id: "", label: "" });

    return (
        <>
            <PageMeta
                title="JiEdu Attendance | Mark Attendance Page"
                description="Attendance Page for JiEdu Application used to mark register in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <MarkAttendanceActions 
                        filters={filters}
                        setFilters={setFilters}
                        status={status}
                        setStatus={setStatus}
                        setSelectedMode={setSelectedMode}
                    />

                    {selectedMode.label === "Manual" && (
                        <MarkattendanceTable 
                            filters={filters}
                            status={status}
                            setStatus={setStatus}
                        />
                    )}

                    {selectedMode.label === "Face Recognition" && (
                        <MarkAttendanceFR
                            filters={filters}
                            status={status}
                            setStatus={setStatus}
                        />
                    )}
                </div>
            </div> 
        </>
    );
}

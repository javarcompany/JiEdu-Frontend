import { useEffect, useState } from "react";
import Button from "../../../components/ui/button/Button";
import axios from "axios";
import Swal from "sweetalert2";
import DictSearchableSelect from "../../../components/form/DictSelect";
import Select from "../../../components/form/Select";
import { UserCheckIcon } from "lucide-react";
import MarkattendanceTable from "../../attendance/markattendance/MarkattendanceTable";
import MarkAttendanceFR from "../../attendance/markattendance/MarkAttendanceFR";
import { useUser } from "../../../context/AuthContext";

type SelectOption = {
    value: string;
    label: string;
    class?: string;
    lecturer?: string;
    term?: string;
};

export default function MarkRegister({ onSubmit }: { onSubmit: (value: boolean) => void }) {
    const token = localStorage.getItem("access");
    const {user} = useUser();
    const [resetKey, setResetKey] = useState(0);
    
    const [modes, setModes] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    
    const [isMarking, setIsMarking] = useState(false);
    const [markingLabel, setMarkingLabel] = useState("Mark Attendance");

    const [filters, setFilters] = useState<{ term: string; class_: string; mode: string; who: string }>({
        term: "",
        class_: "",
        mode: "",
        who: "staff"
    });

    const [mode, setSelectedMode] = useState<{ id: string; label: string }>({ id: "", label: "" });
    const [status, setStatus] = useState<{ [key: string]: string }>({});
    const [lesson_id, setLessonId] = useState<string | null>("0");

    useEffect(() => {
        const fetchModes = async () => {
            try {
                const response = await axios.get("/api/attendance-modes/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((mode: any) => ({
                    value: mode.id.toString(),
                    label: mode.name,
                }));
                setModes(formatted);
                if (formatted.length > 0) {
                    const firstMode = formatted[0];
                    setSelectedMode({ id: firstMode.value, label: firstMode.label });
                }
            } catch (error) {
                console.error("Failed to load register modes", error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/lecturer-classes/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { staff_regno: user?.regno || "" }
                });

                const formatted = response.data.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    term: cls.intake.toString()
                }));
                setClasses(formatted);
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };

        fetchModes();
        fetchClasses();
    }, []);

    const handleSelectClass = async (selected_id: string) => {
        try {
            // Step 1: Check if class has a lesson now
            const lessonRes = await axios.get(
                `/api/check-lesson-lecturer/?class_id=${selected_id}&staff_regno=${user?.regno || ""}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { has_lesson } = lessonRes.data;

            if (!has_lesson) {
                const error = lessonRes.data.error
                Swal.fire("No Lesson", error, "info");
                // Clear class selection
                setFilters((prev) => ({ ...prev, class_: "" }));
                setResetKey(prev => prev + 1);
                return;
            }

            // Step 2: Proceed if valid lesson exists
            await axios.get(
                `/api/classes/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFilters({ ...filters, class_: selected_id });
            setLessonId(lessonRes.data.lesson_id)
        } catch (err: any) {
            // console.error(`Error checking class lesson or fetching class:`, err);
            Swal.fire("Error", err.response.data.error, "error");
            setFilters((prev) => ({ ...prev, class_: "" }));
            setResetKey(prev => prev + 1);
        }
    };
    
    const handleSelectMode = async (selected_id: string) => {
        setFilters({ ...filters, mode: selected_id });
        const selectedOption = modes.find((m) => m.value === selected_id);
        setSelectedMode({ id: selected_id, label: selectedOption?.label || "" });
    };
    
    const handleBatchAllocation = async () => {
        if (!filters.class_) {
            Swal.fire("No selection", "Please select Class to mark attendance.", "info");
            setStatus({});
            return;
        }

        if (filters.mode === "") {
            Swal.fire("No Mode", "Please select an attendance mode.", "info");
            return;
        }

        const selectedMode = modes.find((m) => m.value === filters.mode);
        const isFaceMode = selectedMode?.label?.toLowerCase().includes("face");

        if (isFaceMode) {
            // Face Recognition mode behavior
            setIsMarking(true);
            setMarkingLabel("Recognizing Faces...");

            try {
                const payload = { lesson_id: lesson_id };
                const res = await axios.post("/api/face-attendance/", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(res)
 
                // Handle success
                if (res.data?.success) {
                    Swal.fire("Success", res.data.success, "success");
                } 
                // Handle custom message from backend (e.g., "no face found")
                else if (res.data?.message) {
                    Swal.fire("Info", res.data.message, "info");
                } 
                // Fallback if no structured response
                else {
                    Swal.fire("Error", res.data.error, "error");
                }
            } catch (err: any) {
                console.error("Face recognition error", err);

                let message = "Face recognition failed. Try again.";

                // Extract server error message if available
                if (err.response?.data?.error) {
                    message = err.response.data.error;
                } else if (err.response?.data?.detail) {
                    message = err.response.data.detail;
                } else if (err.message) {
                    message = err.message;
                }

                Swal.fire("Error", message, "error");
            } finally {
                setIsMarking(false);
                setMarkingLabel("Mark Attendance");
            }

        } else {
            // Manual mode
            if (Object.keys(status).length === 0) {
                Swal.fire("No selection", "Please mark at least one record.", "info");
                return;
            }

            try {
                Swal.fire({
                    title: "Marking Attendance...",
                    text: "Please wait while saving records...",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                const payload = {
                    attendance: status,
                    mode_id: filters.mode,
                    lesson_id: lesson_id
                };

                const res = await axios.post("/api/mark-attendance/", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.close();

                if (res.data.error?.length) {
                    Swal.fire("Errors", res.data.error, "error");
                } else {
                    Swal.fire("Success", res.data.success || "Attendance marked successfully.", "success");
                }
            } catch (error) {
                Swal.close();
                Swal.fire("Error", "Attendance marking failed. Please try again.", "error");
                console.error(error);
            }
        }
    };

    return (
        <>
        {/* Attendance Marking Actions */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-4 justify-between">
                <div>
                    <DictSearchableSelect
                        items={classes}
                        resetTrigger={resetKey}
                        placeholder="Select Class.."
                        onSelect={(val) => handleSelectClass(val)}
                    />
                </div>

                <div>
                    <Select
                        options={modes}
                        placeholder = "Select Register Mode"
                        onChange = {(val) => handleSelectMode(val)}
                    />
                </div>

                <div>
                    <Button
                        onClick={handleBatchAllocation}
                        size="sm"
                        disabled={isMarking}
                        variant={"primary"}
                        className={isMarking ? "bg-red" : "bg-blue-800"}
                        startIcon={<UserCheckIcon className="w-5 h-5" />}
                    >
                        {markingLabel}
                    </Button>

                </div>
            </div>

        {/* Attendance Marking Content */}
        <div className="">
            {mode.label === "Manual" && filters.class_ !== "" && (
                <MarkattendanceTable 
                    filters={filters}
                    status={status}
                    setStatus={setStatus}
                />
            )}

            {mode.label === "Face Recognition" && filters.class_ !== ""  && (
                <MarkAttendanceFR
                    filters={filters}
                    status={status}
                    setStatus={setStatus}
                />
            )}
        </div>

        </>
    );
}

import { useEffect, useState } from "react";
import Button from "../../../components/ui/button/Button";
import axios from "axios";
import Swal from "sweetalert2";
import DictSearchableSelect from "../../../components/form/DictSelect";
import Select from "../../../components/form/Select";
import { UserCheckIcon, XCircleIcon } from "lucide-react";
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
    
    const [isLoading, setIsLoading] = useState(false);
    const [isMarking, setIsMarking] = useState(false);
    const [markingLabel, setMarkingLabel] = useState("Mark Attendance");

    // Track if face recognition session is active
    const [isFaceRecognitionActive, setIsFaceRecognitionActive] = useState(false);

    const [filters, setFilters] = useState<{ term: string; class_: string; mode: string; who: string }>({
        term: "",
        class_: "",
        mode: "",
        who: "staff"
    });

    const [mode, setSelectedMode] = useState<{ id: string; label: string }>({ id: "", label: "" });
    const [status, setStatus] = useState<{ [key: string]: string }>({});
    const [lesson_id, setLessonId] = useState<string | null>("0");

    const [isRunning, setIsRunning] = useState(false);

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

    useEffect(() => {
        if (!isRunning) return;

        const ws = new WebSocket(`ws://localhost:8000/ws/attendance/${lesson_id}/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "recognition_stopped") {
                setIsRunning(false); // reset button
                setIsMarking(false);
                setIsFaceRecognitionActive(false);
                setMarkingLabel("Mark Attendance");
            }
        };

        return () => ws.close();
    }, [isRunning, lesson_id]);

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

     const showToast = (icon: "success" | "error" | "info", message: string) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon,
            title: message,
        });
    };
    
    const handleSelectMode = async (selected_id: string) => {
        setFilters({ ...filters, mode: selected_id });
        const selectedOption = modes.find((m) => m.value === selected_id);
        setSelectedMode({ id: selected_id, label: selectedOption?.label || "" });
    };
    
    const handleBatchRegister = async () => {
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
            // 👇 If already active → stop recognition
            if (isFaceRecognitionActive) {
                try {
                    setIsLoading(true);
                    setIsMarking(true);
                    setMarkingLabel("Stopping...");

                    const response = await axios.post(
                        "/api/stop-face-attendance/",
                        { lesson_id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (response.data?.success.length > 0) {
                        showToast( "success", response.data.success );
                    }
                    
                    if (response.data?.info.length > 0) {
                        showToast("info", response.data.info );
                    }

                    if (response.data?.errors.length > 0) {
                        showToast("error", response.data.errors || "Unknown error");
                    }

                } catch (err: any) {
                    Swal.fire("Error", err.response?.data?.error || "Failed to stop recognition.", "error");
                } finally {
                    setIsLoading(false);
                    setIsMarking(false);
                    setIsFaceRecognitionActive(false);
                    setMarkingLabel("Mark Attendance");
                }
                return;
            }

            // 👇 Otherwise → start recognition
            setIsMarking(true);
            setIsLoading(true);
            setMarkingLabel("Starting...");
            try {
                const payload = { lesson_id };
                const res = await axios.post("/api/face-attendance/", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data?.success.length > 0) {
                    showToast( "success", res.data.success );
                    setIsFaceRecognitionActive(true);
                    setMarkingLabel("Stop Registering");
                    setIsLoading(false);
                } else{
                    setIsMarking(false);
                    setMarkingLabel("Mark Attendance");
                    setIsLoading(false);
                }
                
                if (res.data?.info.length > 0) {
                    showToast("info", res.data.info );
                }

                if (res.data?.errors.length > 0) {
                    showToast("error", res.data.errors || "Unknown error");
                }

            } catch (err: any) {
                let message =
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    err.message ||
                    "Face recognition failed.";
                showToast("error", message);
            } 
        } else {
            // ✅ Manual mode stays same
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

                const payload = { attendance: status, mode_id: filters.mode, lesson_id };
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
            }
        }
    };

    return (
        <>
            {/* Attendance Marking Actions */}
            <div className="sticky top-0 z-50 py-2">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-2 justify-between">
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
                            onClick={handleBatchRegister}
                            size="sm"
                            disabled={isLoading}
                            variant={"primary"}
                            className={isMarking ? "bg-red-600 hover:bg-red-800" : "bg-blue-800"}
                            startIcon={isMarking ? <XCircleIcon className="w-5 h-5" /> : <UserCheckIcon className="w-5 h-5" />}
                        >
                            {markingLabel}
                        </Button>

                    </div>
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

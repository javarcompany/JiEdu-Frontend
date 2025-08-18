import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { CalendarPlus2 } from "lucide-react";
import DictSearchableSelect from "../../../components/form/DictSelect";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { SelectedIds } from "./AddTables";
import debounce from "lodash.debounce";

type SelectOption = {
    value: string;
    label: string;
    branch?: string;
    course?: string;
    module?: string;
    term?: string;
};

type TableActionsProps = {
    filters: { branch: string, course: string, module: string, term: string, class_: string, day: string };
    setFilters: React.Dispatch<React.SetStateAction<{ branch: string, course: string, module: string, term: string, class_: string, day: string }>>;
    selectedIds: SelectedIds[];
    setSelectedIds: React.Dispatch<React.SetStateAction<SelectedIds[]>>;
};

export default function TableActions({ filters, setFilters, selectedIds, setSelectedIds }: TableActionsProps) {
    const token = localStorage.getItem("access");
    
    const [resetKey, setResetKey] = useState(0);

    const navigate = useNavigate();

    const [branches, setBranches] = useState<SelectOption[]>([]);
    const [courses, setCourses] = useState<SelectOption[]>([]);
    const [modules, setModules] = useState<SelectOption[]>([]);
    const [terms, setTerms] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);

    const fetchClasses = debounce( async () => {
        try {
            const response = await axios.get("/api/classes/?all=true", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formatted = response.data.results.map((cls: any) => ({
                value: cls.id?.toString(),
                label: cls.name?.toString(),
                branch: cls.branch?.toString(),
                course: cls.course?.toString(),
                module: cls.module?.toString(),
                term: cls.intake?.toString()
            }));
            setClasses(formatted);
        } catch (error) {
            console.error("Failed to load classes", error);
        }
    }, 50);

    useEffect(() => {
        fetchClasses();
    }, [filters.term]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("/api/branches/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((branch: any) => ({
                    value: branch.id.toString(),
                    label: branch.name,
                }));
                setBranches(formatted);
            } catch (error) {
            console.error("Failed to load branches", error);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((course: any) => ({
                    value: course.id.toString(),
                    label: course.name,
                }));
                setCourses(formatted);
            } catch (error) {
                console.error("Failed to load courses", error);
            }
        };

        const fetchModules = async () => {
            try {
                const response = await axios.get("/api/modules/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((module: any) => ({
                    value: module.id.toString(),
                    label: module.name,
                }));
                setModules(formatted);
            } catch (error) {
                console.error("Failed to load modules", error);
            }
        };

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/?range=1", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear,
                }));
                setTerms(formatted);
            } catch (error) {
                console.error("Failed to load terms", error);
            }
        };

        fetchBranches();
        fetchCourses();
        fetchModules();
        fetchTerms();
    }, []);

    const filteredClasses = useMemo(() =>
        classes.filter((cls) => 
            (!filters.branch || cls.branch === filters.branch) &&
            (!filters.course || cls.course === filters.course) &&
            (!filters.module || cls.module?.toString() === filters.module) &&
            (!filters.term || cls.term?.toString() === filters.term)
        ),
    [classes, filters]);

    const handleBatchAllocation = async () => {
        if (filters.class_ === "") {
            Swal.fire("No selection", "Please select Class to alocate to.", "info");
            return;
        }

        if (filters.day === "") {
            Swal.fire("No selection", "Please select Day to alocate to.", "info");
            return;
        }

        if (selectedIds.filter(item => item.lesson && item.workload && item.classroom).length === 0) {
            Swal.fire("No selection", "Please assign workload to any lesson!", "warning");
            return;
        }
 
        try {
            Swal.fire({
                title: "Adding Timetable",
                text: "Please wait while Adding Timetable...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const token = localStorage.getItem("access");
            
            for (const id of selectedIds) {
                if (!id.lesson || !id.workload || !id.classroom) {
                    Swal.fire("Incomplete selection", "Each lesson must have a workload and classroom assigned.", "warning");
                    return;
                }

                try {
                    await axios.post(
                        `/api/allocate-timetable/${filters.class_}/${filters.day}/`,
                        {
                            lesson: id.lesson,
                            workload: id.workload,
                            classroom: id.classroom,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (err: any) {
                    console.error(`Error allocating table ID ${id}:`, err);
                    const msg = err?.response?.data?.detail || "An error occurred.";
                    Swal.fire("Error", msg, "error");
                }
            }

            Swal.close();
            Swal.fire("Success", "Selected timetable has been saved successfully.", "success");

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate("/timetable")
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Allocation failed. Please try again.", "error");
            console.error(error);
        }
    };
    
    const handleSelectModule = (selected_id: string) => {
        setFilters({ ...filters, module: selected_id, class_: "" })
        setResetKey(prev => prev + 1);
    };

    const handleSelectTerm = (selected_id: string) => {
        setFilters({ ...filters, term: selected_id, class_: "" })
        setResetKey(prev => prev + 1);
    };

    const handleSelectClass = async(selected_id: string) => {
        try {
            const res = await axios.get(
                `/api/classes/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilters({ ...filters, branch: res.data.branch.toString(), course: res.data.course.toString(), module: res.data.module.toString(), class_: selected_id})
        } catch (err) {
            console.error(`Error fetching class of id ${selected_id}:`, err);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 md:col-span-12">
            <div className="col-span-12">
                <DictSearchableSelect
                    items={branches}
                    placeholder="Select Branch.."
                    onSelect={(val) =>
                        setFilters({ ...filters, branch: val, course: "", class_: "", module: "" })
                    }
                />
            </div>

            <div className="col-span-12">
                <DictSearchableSelect
                    items={courses}
                    placeholder="Select Course..."
                    onSelect={(val) =>
                        setFilters({ ...filters, course: val, class_: "", module: "" })
                    }
                />
            </div>

            <div className="col-span-12">
                <DictSearchableSelect
                    items={modules}
                    placeholder="Select Module.."
                    onSelect={(val) => handleSelectModule(val)}
                />
            </div>

            <div className="col-span-12">
                <DictSearchableSelect
                    items={terms}
                    placeholder="Select Term.."
                    onSelect={(val) => handleSelectTerm(val)}
                />
            </div>

            <div className="col-span-12">
                <DictSearchableSelect
                    items={filteredClasses}
                    resetTrigger={resetKey}
                    placeholder="Select Class"
                    onSelect={(val) => handleSelectClass(val)}
                />
            </div>

            <div className="col-span-12">
                <ClickableStatCard
                    title="Save Timetable"
                    value=""
                    percentageChange="Add Timetable"
                    contextText=""
                    classvalue="bg-green-800 text-white"
                    icon={<CalendarPlus2 className="w-5 h-5" />}
                    href=""
                    onClick={handleBatchAllocation}
                />
            </div>
        </div>
    );
}

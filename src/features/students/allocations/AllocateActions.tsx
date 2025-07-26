import { ClickableStatCard } from "../../../components/dashboard/StartCard";
import { FolderCheckIcon } from "lucide-react";
import DictSearchableSelect from "../../../components/form/DictSelect";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

type SelectOption = {
    value: string;
    label: string;
    branch?: string;
    course?: string;
    module?: string;
    term?: string;
};

type AllocateActionsProps = {
    filters: { branch: string, course: string, module: string, class_: string, term: string };
    setFilters: React.Dispatch<React.SetStateAction<{ branch: string, course: string, module: string, class_: string, term: string }>>;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function AllocateActions({ filters, setFilters, selectedIds, setSelectedIds }: AllocateActionsProps) {
    const token = localStorage.getItem("access");

    const navigate = useNavigate();

    const [branches, setBranches] = useState<SelectOption[]>([]);
    const [courses, setCourses] = useState<SelectOption[]>([]);
    const [modules, setModules] = useState<SelectOption[]>([]);
    const [terms, setTerms] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    const [resetKey, setResetKey] = useState(0);

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
            setResetKey(prev => prev + 1);
        }
    }, 50);

    useEffect(() => {
        fetchClasses();

    }, [filters.term]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("/api/branches/", {
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
                const response = await axios.get("/api/courses/", {
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
                const response = await axios.get("/api/modules/", {
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
                const response = await axios.get("/api/terms/?all=true", {
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
        fetchClasses();
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
        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select students to alocate.", "info");
            return;
        }

        if (filters.class_ === "") {
            Swal.fire("No selection", "Please select Class to alocate to.", "info");
            return;
        }

        try {
            Swal.fire({
                title: "Allocating Students...",
                text: "Please wait while Allocating students...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const token = localStorage.getItem("access");
            
            for (const id of selectedIds) {
                try {
                    const res = await axios.post(
                        `/api/allocate-student/${id}/${filters.class_}/`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (res.data.error.length) {
                        Swal.close();
                        Swal.fire("Errors", res.data.error, "error");
                        setSelectedIds([])
                        setFilters({branch: "", course:"", module: "", class_: "", term:""})
                        setResetKey(prev => prev + 1);
                        return;
                    }
                } catch (err) {
                    console.error(`Error allocating student ID ${id}:`, err);
                }
            }

            Swal.close();
            Swal.fire("Success", "Selected Student(s) allocated successfully.", "success");

            setFilters({branch: "", course:"", module: "", class_: "", term:""})
            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate("/")
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Allocation failed. Please try again.", "error");
            console.error(error);
        }
    };

    const handleSelectClass = async(selected_id: string) => {
        try {
            const res = await axios.get(
                `/api/classes/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilters({ ...filters, branch: res.data.branch.toString(), course: res.data.course.toString(), module: res.data.module.toString(), class_: selected_id, term: res.data.intake.toString() })
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
                    onSelect={(val) => setFilters({ ...filters, module: val })}
                />
            </div>

            <div className="col-span-12">
                <DictSearchableSelect
                    items={terms}
                    placeholder="Select Term.."
                    onSelect={(val) => {
                        setFilters({ ...filters, term: val })
                        setResetKey(prev => prev + 1);
                    }}
                />
            </div>
            
            <div className="col-span-12">
                <DictSearchableSelect
                    resetTrigger={resetKey} 
                    items={filteredClasses}
                    placeholder="Select Class"
                    onSelect={(val) => handleSelectClass(val)}
                />
            </div>

            <div className="col-span-12">
                <ClickableStatCard
                    title="Allocate Student(s)"
                    value=""
                    percentageChange="Assign"
                    contextText="selected student(s)"
                    classvalue="bg-green-800 text-white"
                    icon={<FolderCheckIcon className="w-5 h-5" />}
                    href=""
                    onClick={handleBatchAllocation}
                />
            </div>
        </div>
    );
}

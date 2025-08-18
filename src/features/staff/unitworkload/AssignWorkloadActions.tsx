import DictSearchableSelect from "../../../components/form/DictSelect";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FilesIcon, UploadCloud } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import debounce from "lodash.debounce";

type SelectOption = {
    value: string;
    label: string;
    class?: string;
    lecturer?: string;
    department?: string;
    branch?: string;
    term?: string;
};

type AllocateActionsProps = {
    filters: { course: string, module: string, term:string; class_: string, lecturer: string, branch: string, department: string };
    setFilters: React.Dispatch<React.SetStateAction<{ course: string, module: string, term:string; class_: string, lecturer: string, branch: string, department: string }>>;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function AssignWorkloadActions({ filters, setFilters, selectedIds, setSelectedIds }: AllocateActionsProps) {
    const token = localStorage.getItem("access");

    const [resetLecturerKey, setResetLecturerKey] = useState(0);
    const [resetClassKey, setResetClassKey] = useState(0);

    const navigate = useNavigate();

    const [lecturers, setLecturers] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    const [terms, setTerms] = useState<SelectOption[]>([]);

    const fetchLecturers = debounce( async () => {
        try {
            const response = await axios.get("/api/staffs/?all=true", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formatted = response.data.results.map((lecturer: any) => ({
                value: lecturer.id.toString(),
                label: lecturer.fullname,
                branch: lecturer.branch.toString(),
                department: lecturer.department.toString()
            }));
            setLecturers(formatted);
        } catch (error) {
            console.error("Failed to load lecturers", error);
        }
    }, 50);

    const fetchClasses = debounce( async () => {
        try {
            const response = await axios.get("/api/classes/?all=true", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formatted = response.data.results.map((cls: any) => ({
                value: cls.id.toString(),
                label: cls.name.toString(),
                term: cls.intake.toString(),
                branch: cls.branch.toString(),
                department: cls.department.toString()
            }));
            setClasses(formatted);
        } catch (error) {
            console.error("Failed to load classes", error);
        }
    }, 50);

    const fetchTerms = debounce( async () => {
        try {
            const response = await axios.get("/api/terms/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formatted = response.data.results.map((term: any) => ({
                value: term.id.toString(),
                label: term.termyear
            }));
            setTerms(formatted);
        } catch (error) {
            console.error("Failed to load intakes", error);
        }
    }, 50);

    const reloadData = async () => {
        await Promise.all([
            fetchLecturers(),
            fetchClasses(),
            fetchTerms()
        ]);
    };

    useEffect(() => {
        reloadData();
    }, []);

    const filteredClasses = classes.filter((cls) => {
        const intakeMatch = !filters.term || cls.term?.toString() === filters.term;
        const branchMatch = !filters.branch || cls.branch?.toString() === filters.branch;
        const departmentMatch = !filters.department || cls.department?.toString() === filters.department;
        return intakeMatch && branchMatch && departmentMatch;

    });

    const filteredLecturers = lecturers.filter((lec) => {
        const branchMatch = !filters.branch || lec.branch?.toString() === filters.branch;
        const departmentMatch = !filters.department || lec.department?.toString() === filters.department;
        return branchMatch && departmentMatch;
    });
    
    const handleBatchAllocation = async () => {
        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select unit(s) to assign.", "info");
            return;
        }

        if (filters.lecturer === "") {
            Swal.fire("No selection", "Please select Lecturer to assign to.", "info");
            return;
        }

        if (filters.class_ === "") {
            Swal.fire("No selection", "Please select Class to assign to.", "info");
            return;
        }

        if (filters.term === "") {
            Swal.fire("No selection", "Please select the term.", "info");
            return;
        }

        try {
            Swal.fire({
                title: "Assigning Units...",
                text: "Please wait while assigning workloads...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const token = localStorage.getItem("access");
            const payload = {
                unit_ids: selectedIds,
                lecturer_id: filters.lecturer,
                class_id: filters.class_
            };

            const res = await axios.post("api/workload/assign-batch/", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.close();

            if (res.data.error.length) {
                Swal.fire("Errors", res.data.error, "error");
            }else {
                Swal.fire("Success", res.data.success, "success");
            }

            setSelectedIds([]); // Clear selection
            // Optionally, you can emit a refresh signal here if needed
            navigate("/unit-workload")

        } catch (error) {
            Swal.close();
            Swal.fire("Error", "Allocation failed. Please try again.", "error");
        }
    };

    const handleSelectClass = async(selected_id: string) => {
        try {
            const res = await axios.get(
                `/api/classes/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilters({ ...filters, branch:res.data.branch.toString(), course: res.data.course.toString(), module: res.data.module.toString(), department: res.data.department.toString(), class_: selected_id })
            setResetLecturerKey(prev => prev + 1);
        } catch (err) {
            console.error(`Error fetching class of id ${selected_id}:`, err);
        }
    };

    const handleSelectLecturer = async(selected_id: string) => {
        try {
            const res = await axios.get(
                `/api/staffs/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilters({ ...filters, branch:res.data.branch.toString(), department: res.data.department.toString(), lecturer: selected_id })
        } catch (err) {
            console.error(`Error fetching class of id ${selected_id}:`, err);
        }
    };

    // Term select handler
    const handleSelectTerm = (val: string) => {
        if (!val) {
            // Term erased — reload all data
            reloadData();
            setFilters({
                ...filters,
                term: "",
                class_: "",
                lecturer: "",
                department: "",
                branch: ""
            });
            setResetLecturerKey(prev => prev + 1);
            setResetClassKey(prev => prev + 1);
        } else {
            // Term selected — reset class & lecturer
            setFilters({
                ...filters,
                term: val,
                class_: "",
                lecturer: "",
                department: "",
                branch: ""
            });
            setResetLecturerKey(prev => prev + 1);
            setResetClassKey(prev => prev + 1);
        }
    };

    // Class select handler
    const handleSelectClassWrapper = (val: string) => {
        if (!val) {
            // Class erased — reset based on current term and reset lecturer
            setFilters({
                ...filters,
                class_: "",
                lecturer: ""
            });
            fetchClasses(); // reload full class list first
        } else {
            handleSelectClass(val);
            // Reset lecturer but keep term
            setFilters({
                ...filters,
                lecturer: ""
            });
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <DictSearchableSelect
                    items={terms}
                    placeholder="Select Term.."
                    onSelect={(val) => handleSelectTerm(val) }
                />
            </div>

            <div>
                <DictSearchableSelect
                    items={filteredClasses}
                    resetTrigger={resetClassKey}
                    placeholder="Select Class.."
                    onSelect={(val) => handleSelectClassWrapper(val)}
                />
            </div>

            <div>
                <DictSearchableSelect
                    items={filteredLecturers}
                    resetTrigger={resetLecturerKey}
                    placeholder="Select Lecturer.."
                    onSelect={(val) => handleSelectLecturer(val)}
                />
            </div>

            <div>
                <Button
                    onClick={handleBatchAllocation}
                    size="sm"
                    variant="primary"
                    startIcon={<UploadCloud className="w-5 h-5" />}
                    endIcon={<FilesIcon className="w-5 h-5" />}
                >
                    Assign Units
                </Button>
            </div>
        </div>
    )
};
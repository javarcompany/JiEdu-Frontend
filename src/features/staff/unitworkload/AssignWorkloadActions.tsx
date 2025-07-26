import DictSearchableSelect from "../../../components/form/DictSelect";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FilesIcon, UploadCloud } from "lucide-react";
import Button from "../../../components/ui/button/Button";

type SelectOption = {
    value: string;
    label: string;
    class?: string;
    lecturer?: string;
    term?: string;
};

type AllocateActionsProps = {
    filters: { course: string, module: string, term:string; class_: string, lecturer: string };
    setFilters: React.Dispatch<React.SetStateAction<{ course: string, module: string, term:string; class_: string, lecturer: string }>>;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function AssignWorkloadActions({ filters, setFilters, selectedIds, setSelectedIds }: AllocateActionsProps) {
    const token = localStorage.getItem("access");

    const navigate = useNavigate();

    const [lecturers, setLecturers] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    const [terms, setTerms] = useState<SelectOption[]>([]);

    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const response = await axios.get("/api/staffs/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((lecturer: any) => ({
                    value: lecturer.id.toString(),
                    label: lecturer.fullname,
                }));
                setLecturers(formatted);
            } catch (error) {
            console.error("Failed to load lecturers", error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/classes/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    term: cls.intake.toString()
                }));
                setClasses(formatted);
                console.log("Classes: ", formatted)
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear
                }));
                setTerms(formatted);
                console.log("Terms: ", formatted)
            } catch (error) {
                console.error("Failed to load intakes", error);
            }
        };

        fetchLecturers();
        fetchClasses();
        fetchTerms();
    }, []);

    const filteredClasses = classes.filter((cls) => {
        const intakeMatch = !filters.term || cls.term?.toString() === filters.term;

        return intakeMatch;

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

            console.log(res.data)

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
            console.error(error);
        }
    };

    const handleSelectClass = async(selected_id: string) => {
        try {
            const res = await axios.get(
                `/api/classes/${selected_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilters({ ...filters, course: res.data.course.toString(), module: res.data.module.toString(), class_: selected_id })
        } catch (err) {
            console.error(`Error fetching class of id ${selected_id}:`, err);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <DictSearchableSelect
                    items={terms}
                    placeholder="Select Term.."
                    onSelect={(val) =>
                        setFilters({ ...filters, term: val, class_:"", lecturer: ""})
                    }
                />
            </div>

            <div>
                <DictSearchableSelect
                    items={filteredClasses}
                    placeholder="Select Class.."
                    onSelect={(val) => handleSelectClass(val)}
                />
            </div>

            <div>
                <DictSearchableSelect
                    items={lecturers}
                    placeholder="Select Lecturer.."
                    onSelect={(val) =>
                        setFilters({ ...filters, lecturer: val})
                    }
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
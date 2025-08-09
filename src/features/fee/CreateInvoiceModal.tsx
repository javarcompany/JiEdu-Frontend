import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Checkbox from "../../components/form/input/Checkbox";

import { StudentAllocation } from "../students/allocations/StudentAllocationTable";
import { Class } from "../classes/ClassesTable";
import { CourseDuration } from "../courses/CoursesTable";

import debounce from "lodash.debounce";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CreateInvoiceModal({ open, onClose }: Props) {
    const token = localStorage.getItem("access");
    const [targetType, setTargetType] = useState<"student" | "class" | "course">("student");
    
    const [trayVisible, setTrayVisible] = useState(false);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [students, setStudents] = useState<StudentAllocation[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<StudentAllocation[]>([]);
    const [selectedStudentsIDs, setSelectedStudentsIds] = useState<number[]>([]);

    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<number[]>([]);

    const [courses, setCourses] = useState<CourseDuration[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    const [voteheads, setVoteheads] = useState<{  value: string; label: string; }[]>([]);

    const [selectedVoteheads, setSelectedVoteheads] = useState<any[]>([]);
    const trayRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                trayRef.current &&
                !(trayRef.current as any).contains(event.target) &&
                !(event.target as HTMLElement).closest(".tray-toggle-button")
            ) {
                setTrayVisible(false);
            }
        };

        if (trayVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [trayVisible]);

    const fetchStudents = debounce(async (query) => {
		try {
			const response = await axios.get(`/api/students-allocations/?active=true&search=${query}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const studentsData = response.data.results || response.data;
			setStudents(studentsData);
		} catch (error) {
			console.error("Failed to fetch Students", error);
		}
	}, 100); // 300ms delay

    const fetchClasses = debounce(async (query) => {
		try {
			const response = await axios.get(`/api/classes/?search=${query}&active=true`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setClasses(response.data.results);
		} catch (error) {
			console.error("Failed to fetch Classes", error);
		}
	}, 100);

    const fetchCourses = debounce(async (query) => {
		try {
			const response = await axios.get(`/api/course-durations/?search=${query}&active=true`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCourses(response.data.results);
		} catch (error) {
			console.error("Failed to fetch Courses", error);
		}
	}, 100);

    useEffect(() => {
        // Fetch initial data for students, classes, courses, and voteheads
        const fetchAccounts = async () => {
            try{
                const response = await axios.get("/api/accounts/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((vote: any) => ({
                    value: vote.id.toString(),
                    label: vote.votehead.toString()
                }));
                setVoteheads(formatted);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
    
        fetchStudents(searchTerm);
        fetchClasses(searchTerm);
        fetchCourses(searchTerm);

        fetchAccounts();
    }, [token, searchTerm]);

    const handleAddVotehead = () => {
        setSelectedVoteheads([...selectedVoteheads, { votehead: "", amount: "" }]);
    };

    const handleDeleteVotehead = (index: number) => {
        const updated = [...selectedVoteheads];
        updated.splice(index, 1);
        setSelectedVoteheads(updated);
    };

    const handleVoteheadChange = (index: number, field: string, value: any) => {
        const updated = [...selectedVoteheads];
        updated[index][field] = value;
        setSelectedVoteheads(updated);
    };

    const isAllStudentsSelected = selectedStudentsIDs.length === students.length && students.length > 0;

    const isAllClassesSelected = selectedClass.length === classes.length && classes.length > 0;

    // Select All handler
    const handleSelectAllStudents = (e: boolean) => {
        if (e) {
            // Select all student IDs
            setSelectedStudentsIds(students.map((s) => s.id));
            setSelectedStudents(students.map((s) => s));
        } else {
            // Deselect all
            setSelectedStudentsIds([]);
            setSelectedStudents([]);
        }
    };

    const handleSelectAllClasses = (e: boolean) => {
        if (e) {
            // Select all classes IDs
            setSelectedClass(classes.map((cls) => cls.id));
        } else {
            // Deselect all
            setSelectedClass([]);
        }
    };

    const handleSelectOneStudent = (id: number) =>{
        setSelectedStudentsIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    const handleSelectOneClass = (id: number) =>{
        setSelectedClass((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    const handleSelectOneCourse = (id: number) => {
        setSelectedCourse(id); // always replace, no toggle
    };

    const handleCloseModal = () => {
        
        setSelectedVoteheads([]);
        setSelectedClass([]);
        setSelectedCourse(null);
        setSelectedStudents([]);
        setSelectedStudentsIds([]);

        onClose();
    }

    const handleInvoiceCreation = async () => {
        try {
            // 1️⃣ Check if voteheads exist
            if (selectedVoteheads.length === 0) {
                Swal.fire("Error", "Please add voteheads", "error");
                return;
            }

            // 2️⃣a Check if all voteheads have an voteheads entered
            const hasEmptyVotehead = selectedVoteheads.some(vh => !vh.votehead || vh.accounts === "");
            if (hasEmptyVotehead) {
                Swal.fire("Error", "Please selects account for all voteheads", "error");
                return;
            }
            
            // 2️⃣b Check if all voteheads have an amount entered
            const hasEmptyAmount = selectedVoteheads.some(vh => !vh.amount || vh.amount <= 0);
            if (hasEmptyAmount) {
                Swal.fire("Error", "Please enter amount for all voteheads", "error");
                return;
            }

            // 3️⃣ If target is student, check student selection
            if (targetType === "student") {
                if (!selectedStudentsIDs || selectedStudentsIDs.length === 0) {
                    Swal.fire("Info", "Please select at least one student", "info");
                    return;
                }

                const response = await axios.post(
                    "/api/create-invoice-student/", 
                    {student_ids: selectedStudents.map(s => s.id), voteheads: selectedVoteheads},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(response)

            } else {
                // 7️⃣ If not student tab (class/course), proceed with original prompt
                const result = await Swal.fire({
                    title: "Fee structure exists",
                    text: "Apply course structure or create custom invoice?",
                    icon: "question",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Apply Course Structure",
                    denyButtonText: "Create Custom Invoice",
                });

                if (result.isConfirmed) {
                    await axios.post("/api/apply-structure-as-invoice/", {
                        target_type: targetType,
                    });
                } else if (result.isDenied) {
                    await axios.post("/api/create-invoice/", {
                        target_type: targetType,
                        voteheads: selectedVoteheads,
                        apply_as_structure: false,
                    });
                }
            }

            Swal.fire("Success", "Invoice process completed", "success");
            onClose();
            
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Something went wrong while processing invoice", "error");
        }
    };
    console.log("Selected Student: ", selectedStudents)
    return (
        <>
            <div className="relative">
                <Modal isOpen={open} onClose={handleCloseModal} className="max-w-[700px] m-4 max-h-[100vh] items-start">
                    <div className="relative w-full h-full overflow-y-auto bg-white rounded-3xl p-4 dark:bg-gray-900 lg:p-11 custom-scrollbar">
                        {/* Header */}
                        <h2 className="text-2xl font-semibold mb-4">Create Invoice</h2>

                        {/* Target Type Toggle */}
                        <div className="flex gap-2 mb-4">
                            {["student", "class", "course"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setTrayVisible(true);
                                        if (targetType !== type) { // Only run if different button clicked
                                            setTargetType(type as any);
                                            setSelectedClass([]);
                                            setSelectedStudents([]);
                                            setSelectedStudentsIds([]);
                                            setSelectedCourse(null);
                                        }
                                    }}
                                    className={`px-3 py-1 rounded text-sm font-medium border ${
                                    targetType === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                        
                        {/* Votehead Table */}
                        <div className="overflow-x-auto max-h-[30vh]">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Votehead</th>
                                        <th className="px-4 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedVoteheads.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2">
                                                <Select
                                                    options={voteheads}
                                                    placeholder = "Select Votehead"
                                                    onChange = {(val) => handleVoteheadChange(index, "votehead", val)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-right flex items-center justify-end gap-2">
                                            
                                                <NumericFormat
                                                    className="
                                                        w-full rounded-lg border appearance-none px-4 py-2.5 text-md 
                                                        shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                                                        dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50 z-999
                                                        hover:border-brand-300 hover:shadow-xl dark:hover:border-brand-500
                                                        bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                                                        focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                                                        dark:focus:border-brand-800 text-end
                                                    "
                                                    placeholder="Enter Amount"
                                                    value={row.amount}
                                                    thousandSeparator="," 
                                                    allowNegative={false}
                                                    prefix={row.amount ? "KES " : ""}
                                                    onValueChange={(e) => handleVoteheadChange(index, "amount", e.value)}
                                                />

                                                <button
                                                    onClick={() => handleDeleteVotehead(index)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                                                    title="Delete votehead"
                                                >
                                                    {/* Trash Icon (you can replace with react-icons or lucide if preferred) */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td colSpan={2} className="px-4 py-2 text-end">
                                            <Button variant="outline" onClick={handleAddVotehead}>
                                                + Add Votehead
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={onClose} className="px-4 py-2.5">
                                Close
                            </Button>
                            <button
                                type="submit"
                                onClick={handleInvoiceCreation}
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-brand-500 text-white px-4 py-2.5 text-theme-md font-medium shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-brand-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Save Invoice
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Right Tray - floating */}
                {trayVisible && (
                    <div
                        ref={trayRef}
                        className="
                            fixed top-1/2 left-27 transform -translate-y-1/2
                            w-[300px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border
                            transition-transform duration-300 ease-in-out z-[2000]
                        "
                    >
                        <h3 className="text-lg font-medium mb-2">
                            {targetType === "student" && "Select Student"}
                            {targetType === "class" && "Select Class"}
                            {targetType === "course" && "Select Course"}
                        </h3>

                        <input type="text"
                            placeholder="Search entity....."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 mb-3 border rounded-lg dark:bg-gray-900 dark:text-white"
                        />

                        <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                            {targetType === "student" && (
                                <>
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                                            <TableRow>
                                                <TableCell
                                                    isHeader
                                                    className="py-3 px-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    <Checkbox
                                                        className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 checked:text-white"
                                                        checked={isAllStudentsSelected}
                                                        onChange={(e) => {handleSelectAllStudents(e)}}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    isHeader
                                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Student
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Table Body */}

                                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {students.length === 0 ? (
                                                <TableRow>
                                                    <TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
                                                        <div className="p-4 text-sm text-gray-500">No student.....</div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                students.map((student) => (
                                                    <TableRow key={student.id}
                                                        className={`cursor-pointer ${
                                                            selectedStudentsIDs.includes(student.id)
                                                                ? "bg-blue-100 dark:bg-blue-900"
                                                                : ""
                                                        }`}
                                                        onClick={() => {
                                                            handleSelectOneStudent(student.id);
                                                            setSelectedStudents((prev) => (prev.includes(student) ? prev.filter((i) => i !== student) : [...prev, student]));
                                                        }}
                                                    >
                                                        <TableCell className="py-3 px-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                            <Checkbox
                                                                checked={selectedStudentsIDs.includes(student.id)}
                                                                onChange={() => {
                                                                    handleSelectOneStudent(student.id);
                                                                    setSelectedStudents((prev) => (prev.includes(student) ? prev.filter((i) => i !== student) : [...prev, student]));
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                                    <img
                                                                        src={student.passport}
                                                                        className="h-[50px] w-[50px]"
                                                                        alt={student.regno}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {student.fname} {student.mname} {student.sname}
                                                                    </p>
                                                                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                                        {student.regno}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}

                            {targetType === "class" && (
                                <>
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                                            <TableRow>
                                                <TableCell
                                                    isHeader
                                                    className="py-3 px-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    <Checkbox
                                                        className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 checked:text-white"
                                                        checked={isAllClassesSelected}
                                                        onChange={(e) => {handleSelectAllClasses(e)}}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    isHeader
                                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Class
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Table Body */}

                                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {classes.length === 0 ? (
                                                <TableRow>
                                                    <TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
                                                        <div className="p-4 text-sm text-gray-500">No class.....</div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                classes.map((class_) => (
                                                    <TableRow key={class_.id}
                                                        className={`cursor-pointer ${
                                                            selectedClass.includes(class_.id)
                                                                ? "bg-blue-100 dark:bg-blue-900"
                                                                : ""
                                                        }`}
                                                        onClick={() => handleSelectOneClass(class_.id)}
                                                    >
                                                        <TableCell className="py-3 px-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                            <Checkbox
                                                                checked={selectedClass.includes(class_.id)}
                                                                onChange={() => handleSelectOneClass(class_.id)}
                                                            />
                                                        </TableCell>

                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {class_.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>  
                                </>
                            )}

                            {targetType === "course" && (
                                <>
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                                            <TableRow>
                                                <TableCell
                                                    isHeader
                                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    ""
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Course
                                                </TableCell>

                                                <TableCell
                                                    isHeader
                                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Module
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Table Body */}

                                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {courses.length === 0 ? (
                                                <TableRow>
                                                    <TableCell  colSpan={2} className="px-5 py-4 sm:px-6 text-start">
                                                        <div className="p-4 text-sm text-gray-500">No course.....</div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                courses.map((course) => (
                                                    <TableRow 
                                                        key={course.id}
                                                        className={`cursor-pointer ${
                                                            selectedCourse === course.id
                                                                ? "bg-blue-100 dark:bg-blue-900"
                                                                : ""
                                                        }`}
                                                        onClick={() => handleSelectOneCourse(course.id)}
                                                    >
                                                        <TableCell className="py-3 px-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                            <Checkbox
                                                                checked={selectedCourse === course.id}
                                                                onChange={() => handleSelectOneCourse(course.id)}
                                                            />
                                                        </TableCell>

                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {course.course_abbr}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {course.module_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

import { useEffect, useState } from "react";
import { StudentAllocation } from "../../../students/allocations/StudentAllocationTable";
import axios from "axios";
import DictSearchableSelect from "../../../../components/form/DictSelect";
import Select from "../../../../components/form/Select";

interface SelectionOption{
    value: string;
    label: string;
    image: string;
}

type ActionsProps = {
    filters: { mode: string, student: string, term:string; };
    setFilters: React.Dispatch<React.SetStateAction<{ mode: string, student: string, term:string; }>>;
};

export default function TopAction({ filters, setFilters }: ActionsProps){

    const token = localStorage.getItem("access");
    const [students, setStudents] = useState<StudentAllocation[]>([]);
    const [studentoptions, setStudentOptions] = useState<SelectionOption[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentAllocation>();
    const [terms, setTerms] = useState<{ 
        value: string;
        label: string;
    }[]>([]);
	const [selectedTerm, setSelectedTerm] = useState<{
        value: string;
        label: string;
    }>();

    const [modes] = useState<SelectionOption[]>([
        { label: "Fee Statement", value: "statement", image: ""},
        { label: "Fee Structure", value: "structure", image: "" },
        { label: "Transaction Log", value: "log", image: "" },
        { label: "Reciepts", value: "reciept", image: "" },
    ]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`/api/students-allocations/?all=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((student: any) => ({
                    value: student.regno.toString(),
                    label: student.fname + " " + student.mname[0] + "." + " " + student.sname + "-" + student.regno,
                    image: student.passport,
                }));
                setStudentOptions(formatted);
                setStudents(response.data.results);
            } catch (error) {
                console.error("Failed to load students", error);
            }
        };

        fetchStudents();

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
				console.error("Failed to load intakes", error);
			}
		};

		fetchTerms();

    }, []);

    const handleSelectMode = async (selected_id: string) => {
        const selectedOption = modes.find((m) => m.value === selected_id);
        setFilters({ ...filters, mode:selectedOption?.value || "" });
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start p-4">
            {/* Left: Selects */}
            <div className="w-full lg:w-1/2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DictSearchableSelect 
                        items={studentoptions}
                        placeholder="Select Student.."
                        onSelect={(value) => {
                            const student = students.find((s) => s.regno === value);
                            setSelectedStudent(student);
                            setFilters({ ...filters, student: value });
                        }}
                    />

                    <DictSearchableSelect
                        items={terms}
                        placeholder="Select Term..."
                        onSelect={(val) => {
                            const term = terms.find((t) => t.value === val);
                            setSelectedTerm(term);
                            setFilters({ ...filters, term: val });
                        }}
                    />

                    <Select
                        options={modes}
                        defaultValue="statement"
                        placeholder="Select Report Type.."
                        onChange={(val) => handleSelectMode(val)}
                    />
                </div>
            </div>

            {/* Right: Student Info */}
            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center gap-4">
                <div className="h-24 w-24 overflow-hidden border border-gray-200 rounded-sm dark:border-gray-800">
                    <img
                        src={selectedStudent?.passport}
                        alt={selectedStudent?.regno}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="text-center sm:text-left">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {selectedStudent?.fname} {selectedStudent?.mname} {selectedStudent?.sname}
                    </h4>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {selectedStudent?.class_name && <span>{selectedStudent.class_name}</span>}
                        {selectedStudent?.branch_name && <span>• {selectedStudent.branch_name} Campus</span>}
                        {selectedTerm?.label && <span>• {selectedTerm.label}</span>}
                        {selectedStudent?.level && <span>• Level {selectedStudent.level}</span>}
                    </div>
                </div>
            </div>
        </div>
    );

}
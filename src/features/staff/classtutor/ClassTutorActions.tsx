import { SearchButton } from "../../../components/dashboard/SearchButton";
import { HousePlusIcon } from "lucide-react";
import ClassTutorSummary from "./ClassTutorSummary";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";

import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";

import DictSearchableSelect from "../../../components/form/DictSelect";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type SelectOption = {
    value: string;
    label: string;
    class?: string;
    branch: string;
    department: string;
    lecturer?: string;
    term?: string;
};

export default function ClassTutorActions({save, setSave, onSearch }: {save:boolean; setSave: (value: boolean)=> void; onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();
    const [allLecturers, setAllLecturers] = useState<SelectOption[]>([]);
    const [lecturers, setLecturers] = useState<SelectOption[]>([]);
    const [allClasses, setAllClasses] = useState<SelectOption[]>([]);
    const [classes, setClasses] = useState<SelectOption[]>([]);
    const token = localStorage.getItem("access");

    const [class_id, setClassID] = useState<string>();
    const [lecturer_id, setLecturerID] = useState<string>();
    
    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const response = await axios.get(`/api/staffs/?all=true`, 
                    {
                    headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const formatted = response.data.results.map((lecturer: any) => ({
                    value: lecturer.id.toString(),
                    label: lecturer.fullname,
                    branch: lecturer.branch.toString(),
                    department: lecturer.department.toString()
                }));
                setAllLecturers(formatted);
                setLecturers(formatted);
            } catch (error) {
                console.error("Failed to load lecturers", error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get("/api/classes/?all=true", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((cls: any) => ({
                    value: cls.id.toString(),
                    label: cls.name.toString(),
                    branch: cls.branch.toString(),
                    department: cls.department.toString(),
                }));
                setAllClasses(formatted);
                setClasses(formatted);
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };

        fetchLecturers();
        fetchClasses();
    }, []);

    // When lecturer is selected → filter classes
    const handleLecturerSelect = (lecturerVal?: string) => {
        setLecturerID(lecturerVal || undefined);

        if (!lecturerVal) {
            // If cleared → restore all
            setClasses(allClasses);
            setLecturers(allLecturers);
            return;
        }

        const selectedLecturer = allLecturers.find(l => l.value === lecturerVal);
        if (selectedLecturer) {
            const filteredClasses = allClasses.filter(c =>
                c.branch === selectedLecturer.branch && c.department === selectedLecturer.department
            );
            setClasses(filteredClasses);
        }
    };

    // When class is selected → filter lecturers
    const handleClassSelect = (classVal?: string) => {
        setClassID(classVal || undefined);

        if (!classVal) {
            // If cleared → restore all
            setClasses(allClasses);
            setLecturers(allLecturers);
            return;
        }

        const selectedClass = allClasses.find(c => c.value === classVal);
        if (selectedClass) {
            const filteredLecturers = allLecturers.filter(l =>
                l.branch === selectedClass.branch && l.department === selectedClass.department
            );
            setLecturers(filteredLecturers);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh

        if (!class_id){
            Swal.fire("Errors", "You haven't selected any class..", "error");
            return;
        }

        if (!lecturer_id){
            Swal.fire("Errors", "You haven't selected any lecturer..", "error");
            return;
        }
                
        Swal.fire({
            title: "Assigning Class Tutor...",
            text: "Please wait while assigning class tutor...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
        
        try {
            const response = await axios.post(
                `/api/tutors/assign/${class_id}/${lecturer_id}/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.close();

            if (response.data.error) {
                Swal.fire("Errors", response.data.error, "error");
            }
            
            if (response.data.message){
                Swal.fire("Success", response.data.message, "success");
            }
            closeModal();
            setSave(!save);
            
        } catch (err) {
            console.error(`Error:`, err);
        }

    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <SearchButton onSearch={onSearch} />
                </div>
                <div className="col-span-12">
                    <Button
                        onClick={openModal}
                        size="sm"
                        variant="primary"
                        startIcon={<HousePlusIcon className="size-5" />}
                    >
                        Assign Class Tutor
                    </Button>
                </div>
                <div className="col-span-12">
                    <ClassTutorSummary save={save} />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4 max-h">
                <div className="relative w-full p-4  bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Assign Class Tutor
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Assign a trainer over a class..
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Lecturer</Label>
                                    <DictSearchableSelect 
                                        items={lecturers}
                                        onSelect={handleLecturerSelect}
                                    />
                                </div>

                                <div>
                                    <Label>Class</Label>
                                    <DictSearchableSelect 
                                        items={classes}
                                        onSelect={handleClassSelect}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <button
                                type="submit"
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-brand-500 text-white px-4 py-2.5 text-theme-md font-medium shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-brand-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Assign Class Tutor
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
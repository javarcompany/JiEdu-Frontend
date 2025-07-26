import { SearchButton } from "../../components/dashboard/SearchButton";
import { FileIcon } from "lucide-react";

import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";

import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

import SearchableSelect from "../../components/form/DictSelect";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function UnitsActions({onSave, onSearch }: {onSave:(value: boolean)=>void, onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();

    const token = localStorage.getItem("access");
    const [courses, setCourses] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [modules, setModules] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [formData, setFormData] = useState({
        uncode: "",
        name: "",
        abbr: "",
        course: "",
        module: "",
        weekly_hours: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCourseSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, course: selected,
        }));
    };

    const handleModuleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, module: selected,
        }));
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert courses to the format expected by SearchableSelect
                const formatted = data.map((course : any) => ({
                    value: course.id.toString(),
                    label: course.name,      
                }));
                
                setCourses(formatted);
                } catch (error) {
                console.error("Failed to load Courses", error);
            }
        };

        const fetchModules = async () => {
            try {
                const response = await axios.get("/api/modules/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert modules to the format expected by SearchableSelect
                const formatted = data.map((module : any) => ({
                    value: module.id.toString(),
                    label: module.name,      
                }));
                
                setModules(formatted);
                } catch (error) {
                console.error("Failed to load Modules", error);
            }
        };

        fetchCourses();
        fetchModules();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
            console.log(formData)
            await axios.post("/api/units/", 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire("Success", "Unit created successfully!", "success");
            setFormData({ name: "", uncode: "", abbr: "", course: "", module: "", weekly_hours: "" });

            onSave(!true);

            closeModal();
        } catch (err: any) {
            const errorMsg = err?.response?.data.uncode || "An unexpected error occurred";
            Swal.fire("Error", `${errorMsg}`, "error");
            setFormData({ name: "", uncode: "", abbr: "", course: "", module: "", weekly_hours: "" });
            closeModal();
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <SearchButton onSearch={onSearch}/>
                </div>
                <div className="col-span-12">
                    
                </div>
                <div className="col-span-12">
                    <Button
                        onClick={openModal}
                        size="md"
                        variant="primary"
                        startIcon={<FileIcon className="size-5" />}
                    >
                        Add Unit
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Unit
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Course</Label>
                                    <SearchableSelect items={courses} onSelect={handleCourseSelect} />
                                </div>

                                <div>
                                    <Label>Module</Label>
                                    <SearchableSelect items={modules} onSelect={handleModuleSelect} />
                                </div>

                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange}/>  
                                </div>

                                <div className="">
                                    <Label>Code</Label>
                                    <Input type="text" name="uncode" value={formData.uncode} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Abbreviation</Label>
                                    <Input type="text" name="abbr" value={formData.abbr} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Weekly Hours</Label>
                                    <Input type="text" name="weekly_hours" value={formData.weekly_hours} onChange={handleChange} />  
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <button
                                type="submit"
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Save Unit
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    )
}
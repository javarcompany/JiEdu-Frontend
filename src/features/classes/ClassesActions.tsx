import { SearchButton } from "../../components/dashboard/SearchButton";
import { Users2Icon } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SearchableSelect from "../../components/form/DictSelect";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { fetchDropdownData } from "../../utils/apiFetch";

export default function ClassesActions({onSave, onSearch }: {onSave:(value: boolean)=>void, onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();
	const token = localStorage.getItem("access");

    const [branches, setBranch] = useState<{ value: string; label: string; }[]>([]);
    const [modules, setModule] = useState<{ value: string; label: string; }[]>([]);
    const [courses, setCourse] = useState<{ value: string; label: string; }[]>([]);
    const [intakes, setIntake] = useState<{ value: string; label: string; }[]>([]);
  
    const [formData, setFormData] = useState({
        name: "",
        course: "",
        intake: "",
        branch: "",
        module: "",
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
    const handleIntakeSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, intake: selected,
        }));
    };
    const handleBranchSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, branch: selected,
        }));
    };
    const handleModuleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, module: selected,
        }));
    };
 
    useEffect(() => {
        const loadDropdowns = async () => {
          setCourse(await fetchDropdownData("/api/courses/?all=true"));
          setModule(await fetchDropdownData("/api/modules/?all=true"));
          setBranch(await fetchDropdownData("/api/branches/?all=true"));
          setIntake(await fetchDropdownData("/api/terms/?all=true", "termyear"));
        };
    
        loadDropdowns();
    }, []);
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
            await axios.post("/api/classes/", 
                formData,
                {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
            );
            Swal.fire("Success", "Class created successfully!", "success");
            setFormData({ name: "", course: "", intake: "", branch: "", module: "" });
            
            onSave(!true);

            closeModal();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create class", "error");
            setFormData({ name: "", course: "", intake: "", branch: "", module: "" });
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
                        startIcon={<Users2Icon className="size-5" />}
                    >
                        Add Class
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Classes
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Branch</Label>
                                    <SearchableSelect items={branches} onSelect={handleBranchSelect} />
                                </div>

                                <div>
                                    <Label>Course</Label>
                                    <SearchableSelect items={courses} onSelect={handleCourseSelect} />
                                </div>

                                <div>
                                    <Label>Intake</Label>
                                    <SearchableSelect items={intakes} onSelect={handleIntakeSelect} />
                                </div>

                                <div>
                                    <Label>Module</Label>
                                    <SearchableSelect items={modules} onSelect={handleModuleSelect} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 py-5 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange} />  
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
                                Save Class
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    )
}
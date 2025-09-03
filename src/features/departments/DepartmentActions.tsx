import { SearchButton } from "../../components/dashboard/SearchButton";
import { HousePlusIcon } from "lucide-react";
import { FolderIcon } from "../../icons";

import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";

import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

export default function DepartmentActions({onSave, onSearch }: {onSave:(value: boolean)=>void, onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();
	const token = localStorage.getItem("access");

    const [formData, setFormData] = useState({
        name: "",
        abbr: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
            await axios.post("/api/departments/", 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire("Success", "Department created successfully!", "success");
            setFormData({ name: "", abbr: "" });
            closeModal();
            onSave(!true);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create department", "error");
            setFormData({ name: "", abbr: "" });
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
                    <Button
                        onClick={openModal}
                        size="md"
                        variant="primary"
                        startIcon={<FolderIcon className="size-5" />}
                    >
                        Add Category
                    </Button>
                </div>
                <div className="col-span-12">
                    <Button
                        onClick={openModal}
                        size="md"
                        variant="primary"
                        startIcon={<HousePlusIcon className="size-5" />}
                    >
                        Add Department
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Department
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text"  name="name" value={formData.name} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Abbreviation</Label>
                                    <Input type="text"  name="abbr" value={formData.abbr} onChange={handleChange}   />  
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
                                Save Department
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    )
}
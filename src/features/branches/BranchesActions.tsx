import { SearchButton } from "../../components/dashboard/SearchButton";
import { HousePlusIcon } from "lucide-react";

import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";

import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function BranchesActions({onSave, onSearch }: {onSave:(value: boolean)=>void, onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();
    const token = localStorage.getItem("access");

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        paddr: "",
        tel_a: "",
        tel_b: "",
        email: "",
    });

    const [error, setError] = useState({
        email: false,
        tel_a: false,
        tel_b: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    
        // Basic field validation
        if (name === "email") {
          const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
          setError(prev => ({ ...prev, email: !valid }));
        }
        if (name === "tel_a") {
          const valid = /^\d{10,}$/.test(value);
          setError(prev => ({ ...prev, tel_a: !valid }));
        }
        if (name === "tel_b"){
            const valid = /^\d{10,}$/.test(value);
            setError(prev => ({ ...prev, tel_b: !valid}));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        if (error.email || error.tel_a) {
            Swal.fire("Invalid input", "Please fix errors before submitting", "error");
            return;
        }
      
        try {
            await axios.post("/api/branches/", 
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            Swal.fire("Success", "Branch created successfully!", "success");
            setFormData({ name: "", code: "", paddr: "", tel_a: "", tel_b: "", email: "" });
            closeModal();
            onSave(!true);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create branch", "error");
            setFormData({ name: "", code: "", paddr: "", tel_a: "", tel_b: "", email: "" });
            closeModal();
        }
    };
      
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <SearchButton  onSearch={onSearch}/>
                </div>
                <div className="col-span-12">
                    <Button
                        onClick={openModal}
                        size="sm"
                        variant="primary"
                        startIcon={<HousePlusIcon className="size-5" />}
                    >
                        Add Branch
                    </Button>
                </div>
                <div className="col-span-12">
                    
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Branch
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand Institution in another region
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text"  name="name" value={formData.name} onChange={handleChange}  />  
                                </div>

                                <div>
                                    <Label>Code</Label>
                                    <Input type="text"  name="code" value={formData.code} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Phone A</Label>
                                    <Input
                                        type="text"
                                        name="tel_a"
                                        value={formData.tel_a}
                                        onChange={handleChange}
                                        error={error.tel_a}
                                        hint={error.tel_a ? "Enter a valid phone number" : ""}
                                    
                                    />
                                </div>

                                <div>
                                    <Label>Phone B</Label>
                                    <Input 
                                        type="text" 
                                        name="tel_b" 
                                        value={formData.tel_b} 
                                        onChange={handleChange} 
                                        error={error.tel_b}
                                        hint={error.tel_b ? "Enter a valid phone number" : ""}
                                    
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={error.email}
                                        hint={error.email ? "This is an invalid email address." : ""}
                                    
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Address</Label>
                                    <Input type="text" name="paddr" value={formData.paddr} onChange={handleChange} />
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
                                Save Branch
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
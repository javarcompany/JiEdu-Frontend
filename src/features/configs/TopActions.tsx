import Button from "../../components/ui/button/Button";
import { UploadIcon } from "lucide-react";
import { HousePlugIcon } from "lucide-react";

import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { Modal } from "../../components/ui/modal";

import { FormDataState } from "./InstitutionCard";
import { toast } from "react-toastify";
import DownloadTemplateButton from "./DownloadTemplate";

type TopActionsProps = {
    onPromoteSuccess: () => void;
};
 
export function showToastsInSequence(messages: any[], delay = 1500) {
    messages.forEach((msg, index) => {
        setTimeout(() => {
            toast.error(msg); // You can use toast.success/info/warning depending on context
        }, delay * index);
    });
}

export default function TopActions({ onPromoteSuccess }: TopActionsProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const token = localStorage.getItem("access");
    
    const [submitting, setSubmitting] = useState(false);

    const [saving, setSaving] = useState(false);
    
    const [yearoptions, setYears] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [intakeoptions, setIntakes] = useState<{ 
        value: string;
        label: string;
    }[]>([]);
    
    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const response = await axios.get(`/api/institution/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFormData(response.data);
            } catch (error) {
                console.error("Failed to fetch institution form", error);
            }
        };

        const fetchYears = async () => {
            try {
                const response = await axios.get("/api/academic-year/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // Convert academic years to the format expected by SearchableSelect
                const formatted = response.data.results.map((acyear : any) => ({
                    value: acyear.id.toString(),
                    label: acyear.name,      
                }));
                
                setYears(formatted);
                } catch (error) {
                console.error("Failed to load Years", error);
            }
        };

        const fetchIntakes = async () => {
            try {
                const response = await axios.get("/api/intakes/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); 
                // Convert intakes to the format expected by SearchableSelect
                const formatted = response.data.results.map((intake : any) => ({
                    value: intake.id.toString(),
                    label: intake.name,      
                }));
                
                setIntakes(formatted);
                } catch (error) {
                console.error("Failed to load Intakes", error);
            }
        };

        fetchInstitution();
        fetchYears();
        fetchIntakes();
    },[!saving]);

    const [formData, setFormData] = useState<FormDataState>({
        logo: null, name: "", motto: "", mission: "",
        vision: "", paddr: "", tel_a: "", tel_b: "", facebook: "",
        instagram: "", youtube: "", twitter: "", telegram: "", tiktok: "", email: "",
        current_year: "", year: "", current_intake: "", intake: "", newsystem: "",
        dof: "", passport: ""
    });

    const handleSelectChange = (option: any, field: string) => {
        console.log(field, ":", option )
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we submit the details.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        e.preventDefault();
        setSubmitting(true);

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                form.append(key, value, value.name);
            } else if (value !== null) {
                form.append(key, value);
            }
        });

        try {
            const response = await fetch('api/institution/1/', {
                method: 'PUT', // or 'PUT'
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            Swal.close()

            if (!response.ok) throw new Error('Failed to update institution');

            Swal.fire("Success", 'Institution updated successfully', "success");
            setFormData({
                logo: null, name: "", motto: "", mission: "",
                vision: "", paddr: "", tel_a: "", tel_b: "", facebook: "",
                instagram: "", youtube: "", twitter: "", telegram: "", tiktok: "", email: "",
                current_year: "", year: "", current_intake: "", intake: "", newsystem: "",
                dof: "", passport: ""
            })
            setSaving(true);
            closeModal();
            if (onPromoteSuccess) onPromoteSuccess();
        } catch (err) {
            console.error(err);
            Swal.fire("Failure",'Update failed!', "error");
        } finally {
            setSubmitting(false);
        }
    };

    const promoteSystem = async () => {
        Swal.fire({
            title: "Promoting System...",
            text: "Please wait while we promote the system to the next intake.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setSubmitting(true);
  
        try {
            const response = await axios.post('api/promote-system/',
                {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.close()

            console.log("Promotion response:", response.data);   

            if (response.status !== 200) throw new Error('Failed to promote system');

            Swal.fire("Success", response.data.message || 'Institution promoted successfully', "success");
    
            closeModal();
            if (onPromoteSuccess) onPromoteSuccess();
        } catch (error: any) {
            Swal.close()

            // Log the error to the console for debugging
            console.error("Promotion failed:", error.response?.data || error.message);
            let errorMsgs = ["Promotion failed!"];
            if (error.response?.data?.error) {
                errorMsgs = Array.isArray(error.response.data.error)
                    ? error.response.data.error
                    : [error.response.data.error];
            }

            showToastsInSequence(errorMsgs);
        } finally {
            setSubmitting(false);
        }

    }

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-3">
                    <Button
                        onClick={openModal}
                        size="sm"
                        variant="outline"
                        startIcon={<HousePlugIcon className="size-5" />}
                    >
                        Change System Parameters
                    </Button>
                </div>

                <div className="col-span-3">
                    <DownloadTemplateButton />
                </div>

                <div className="col-span-3">

                </div>

                <div className="col-span-3">
                    <Button
                        onClick={promoteSystem}
                        size="sm"
                        variant="primary"
                        startIcon={<UploadIcon className="size-5" />}
                        className=""
                    >
                        Promote System
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Change Current Settings
                        </h4>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="custom-scrollbar  overflow-y-auto px-2 pb-3">

                            <div className="mt-7">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    
                                    <div className="col-span-1 lg:col-span-1">
                                        <Label>Current Year</Label>
                                        <Select
                                            options={yearoptions}
                                            defaultValue={formData?.year}
                                            placeholder = "Select Current Year"
                                            onChange={(year) => handleSelectChange(year, "current_year")}
                                        />
                                    </div>

                                    <div className="col-span-1 lg:col-span-1">
                                        <Label>Current Intake</Label>
                                        <Select
                                            options={intakeoptions}
                                            defaultValue={formData?.intake}
                                            placeholder = "Select Current Intake"
                                            onChange={(intake) => handleSelectChange(intake, "current_intake")}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>

                            <button 
                                disabled={submitting}
                                type="submit"
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                {submitting ? "Submitting..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
};
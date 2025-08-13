import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";

import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import TextArea from "../../components/form/input/TextArea";

export interface FormDataState {
    logo: File | null | string; name: string; motto: string; mission: string;
    vision: string; paddr: string; tel_a: string; tel_b: string; facebook: string;
    instagram: string; youtube: string; twitter: string; telegram: string; tiktok: string; email: string;
    current_year: string; year: string; current_intake: string; intake: string; newsystem: string;
    dof: string; passport: string;
}

export default function InstitutionCard({data}: {data:number;}) {
    const { isOpen, openModal, closeModal } = useModal();
    const token = localStorage.getItem("access");

    const [submitting, setSubmitting] = useState(false);

    const [saving, setSaving] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    
    const [loading, setLoading] = useState<boolean>(true);

    const [yearoptions, setYears] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [intakeoptions, setIntakes] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [formData, setFormData] = useState<FormDataState>({
        logo: null, name: "", motto: "", mission: "",
        vision: "", paddr: "", tel_a: "", tel_b: "", facebook: "",
        instagram: "", youtube: "", twitter: "", telegram: "", tiktok: "", email: "",
        current_year: "", year: "", current_intake: "", intake: "", newsystem: "",
        dof: "", passport: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name:string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, [name]: file }));
    };

    const handleSelectChange = (option: any, field: string) => {
        console.log(field, ":", option )
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateEmail = (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    
    const handleEmailChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(!validateEmail(value));
        setFormData((prev) => ({ ...prev, email: value }));
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
            const firstTimeRes  = await fetch('/api/institution/', {
                method :'GET',
                headers: {
                        Authorization: `Bearer ${token}`,
                    },
            });
            

            if (firstTimeRes.status === 404){
                const response = await fetch('api/institution/', {
                    method: 'POST', // or 'PUT'
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                });
                if (!response.ok) throw new Error('Failed to update institution');
            }else{
                const response = await fetch('api/institution/1/', {
                    method: 'PUT', // or 'PUT'
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: form,
                });
                if (!response.ok) throw new Error('Failed to update institution');
            }
            Swal.close()       

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
        } catch (err) {
            Swal.close()  
            console.error(err);
            Swal.fire("Failure",'Update failed!', "error");
        } finally {
            Swal.close()  
            setSubmitting(false);
        }
    };
    
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
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch institution form", error);
                setLoading(false);
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
    },[!saving, email, data]);

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading institution data...</div>;
    }

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                    
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img src={formData?.passport} alt={formData?.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {formData?.name}
                            </h4>

                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData?.motto}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                            <a
                                href={formData?.facebook}
                                target="_blank"
                                rel="noopener"
                                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                                    fill=""
                                    />
                                </svg>
                            </a>

                            <a
                                href={formData?.twitter}
                                target="_blank"
                                rel="noopener"
                                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                                    fill=""
                                    />
                                </svg>
                            </a>

                            <a
                                href={formData?.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-sm font-medium shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M12 2h3.077c.19 1.462 1.165 2.89 2.918 2.978V8.18c-1.121-.034-2.17-.412-3.077-1.038v6.82c0 2.82-2.217 5.04-5.038 5.04A5.04 5.04 0 014.84 13c0-2.73 2.152-4.948 4.84-5.038v3.17A1.86 1.86 0 008.04 13a1.86 1.86 0 001.84 1.87c1.02 0 1.858-.85 1.858-1.87V2z"/>
                                </svg>
                            </a>

                            <a
                                href={formData?.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1 1 0 100 2 1 1 0 000-2z"/>
                                </svg>
                            </a>

                            <a
                                href={formData?.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a2.99 2.99 0 00-2.106-2.113C19.63 3.5 12 3.5 12 3.5s-7.63 0-9.392.573a2.99 2.99 0 00-2.106 2.113A31.8 31.8 0 000 12a31.8 31.8 0 00.502 5.814 2.99 2.99 0 002.106 2.113C4.37 20.5 12 20.5 12 20.5s7.63 0 9.392-.573a2.99 2.99 0 002.106-2.113A31.8 31.8 0 0024 12a31.8 31.8 0 00-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                                </svg>
                            </a>

                            <a
                                href={formData?.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M9.04 16.44l-.38 5.26c.54 0 .77-.23 1.06-.5l2.54-2.4 5.28 3.88c.97.53 1.66.25 1.91-.9L24 3.8c.34-1.36-.5-1.9-1.38-1.57L1.1 10.2c-1.31.53-1.3 1.27-.24 1.6l5.57 1.74 12.94-8.14c.61-.4 1.17-.18.72.22"/>
                                </svg>
                            </a>
                        </div>
                        
                    </div>

                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                            Edit
                    </button>
                </div>

                {/* Mission Statement */}
                <div className="flex flex-col py-2 gap-y-2 gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
                            Mission Statement
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-4 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    {formData?.mission}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision Statement */}
                <div className="flex flex-col py-2 gap-y-2 gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
                            Vision
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-4 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    {formData?.vision}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="flex flex-col py-2 gap-y-2 gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
                            Address
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Location
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formData?.paddr}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Phone Number
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formData?.tel_a} | {formData?.tel_b}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Email
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formData?.email}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Current Intake
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formData?.year} - {formData?.intake}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Institution's Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your profile up-to-date.
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Social Links
                                </h5>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Facebook</Label>
                                        <Input
                                            type="text"
                                            name="facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Instagram</Label>
                                        <Input
                                            type="text"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>X.com</Label>
                                        <Input
                                            type="text"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Telegram</Label>
                                        <Input
                                            type="text"
                                            name="telegram"
                                            value={formData.telegram}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Youtube</Label>
                                        <Input
                                            type="text"
                                            name="youtube"
                                            value={formData.youtube}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Tiktok</Label>
                                        <Input
                                            type="text"
                                            name="tiktok"
                                            value={formData.tiktok}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Basic Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="logo">Logo</Label>
                                        <FileInput 
                                            onChange={(e) => handleFileChange(e, "logo")}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Physical Address</Label>
                                        <Input
                                            type="text"
                                            name="paddr"
                                            value={formData.paddr}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Email Address</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            error={emailError}
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            placeholder="Enter your email"
                                            hint={emailError ? "This is an invalid email address." : ""}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone A</Label>
                                        <Input
                                            type="text"
                                            name="tel_a"
                                            value={formData.tel_a}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone B</Label>
                                        <Input
                                            type="text"
                                            name="tel_b"
                                            value={formData.tel_b}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Current Year</Label>
                                        <Select
                                            options={yearoptions}
                                            defaultValue={formData?.year}
                                            placeholder = "Select Current Year"
                                            onChange={(year) => handleSelectChange(year, "current_year")}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
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

                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Core Values
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    
                                    <div className="col-span-2 lg:col-span-2">
                                        <Label>Motto</Label>
                                        <Input
                                            type="text"
                                            name="motto"
                                            value={formData.motto}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-2">
                                        <Label>Mission</Label>
                                        <TextArea
                                            placeholder="Type the mission statement (s) of the institution.."
                                            name = "mission"
                                            value={formData.mission}
                                            onChange={handleChange}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-2">
                                        <Label>Vision</Label>
                                        <TextArea
                                            placeholder="Type the vision statement (s) of the institution.."
                                            name = "vision"
                                            value={formData.vision}
                                            onChange={handleChange}
                                            rows={3}
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
    );
}

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import DatePicker from "../../../components/form/date-picker";
import { useState, useEffect } from "react";
import Select from "../../../components/form/Select";
import FileInput from "../../../components/form/input/FileInput";
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

interface FormDataState {
    regno: string;
    fname: string;
    mname: string;
    sname: string;
    gender: string;
    nat_id: string;
    phone: string;
    email: string;
    branch: string;
    department: string;
    designation: string;
    weekly_hours: string;
    passport: File | null;
}

export default function RegistrationForm() {
    const token = localStorage.getItem("access");

    const navigate = useNavigate();

    const [email, setStaffEmail] = useState("");
    const [staffEmailError, setStaffEmailError] = useState(false);

    const [genderoptions, setGenders] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [branches, setBranches] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [departments, setDepartments] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchGenders = async () => {
            axios.get('/api/genders/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                setGenders(response.data);
            })
            .catch(error => {
                console.error("Error fetching gender choices:", error);
            });
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get("/api/departments/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                console.log("Departments: ", data)
                // Convert courses to the format expected by SearchableSelect
                const formatted = data.map((course : any) => ({
                    value: course.id.toString(),
                    label: course.name,      
                }));
                
                setDepartments(formatted);
                } catch (error) {
                console.error("Failed to load departments", error);
            }
        };

        const fetchBranches = async () => {
            try {
                const response = await axios.get("/api/branches/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert branches to the format expected by SearchableSelect
                const formatted = data.map((branch : any) => ({
                    value: branch.id.toString(),
                    label: branch.name,      
                }));
                
                setBranches(formatted);
                } catch (error) {
                console.error("Failed to load Branches", error);
            }
        };

        fetchGenders();
        fetchDepartments();
        fetchBranches();
    }, []);

    const [formData, setFormData] = useState<FormDataState>({
        regno: "", fname: "", mname: "", sname: "", gender: "",
        nat_id: "", phone: "", email: "", department: "",
        branch: "", designation: "", weekly_hours: "", passport: null,
    });

    const validateEmail = (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    
    const handleStaffEmailChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setStaffEmail(value);
        setStaffEmailError(!validateEmail(value));
        setFormData((prev) => ({ ...prev, email: value }));
        console.log("Staff Email:", email)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // console.log(name, ":", value)
    };

    const handleSelectChange = (option: any, field: string) => {
        console.log(field, ":", option )
        if (!option) return; // handle deselection
        const value = typeof option === 'string' ? option : option?.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (date: string | null, name:string) => {
        const formattedDate = date;
        setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    };  

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name:string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        Swal.fire({
            title: "Registering Staff",
            text: "Please wait while submitting staff details...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                form.append(key, value, value.name);
            } else if (value !== null) {
                form.append(key, value);
            }
        });
        
        try {
            const res = await fetch("/api/staffs/", {
                method: "POST",
                body: form, 
                headers: {
                            Authorization: `Bearer ${token}`,
                        },
            });

            if (res.ok) {
                Swal.fire("Success", "Staff registered successfully", "success");
                setFormData({
                    regno: "", fname: "", mname: "", sname: "", gender: "",
                    nat_id: "", phone: "", email: "", department: "",
                    branch: "", designation: "", weekly_hours: "", passport: null,
                });

                navigate("/staff-list")
            } else {
                const errorData = await res.json();
                console.log("Error: ", errorData);
                Swal.fire("Error", errorData.detail || "Submission Failed!", "error");
            }

        } catch (err) {
            Swal.fire("Error", "Network error", "error");
        } finally {
            setSubmitting(false);
        }


    };

    const [step, setStep] = useState(1);
    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (

        <form className="flex flex-col" onSubmit={handleSubmit}>
            {step === 1 && (
                <>
                {/* Section A: Personal Infomation */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Personal Information
                            </h5>

                            <div className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Registration Number</Label>
                                    <Input type="text" name="regno" value={formData.regno} onChange={handleChange} placeholder="JIEDU/STAFF/001"/>
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Last Name</Label>
                                    <Input id="sname" type="text" name="sname" onChange={handleChange} value={formData.sname}  />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>First Name</Label>
                                    <Input type="text" name="fname" value={formData.fname} onChange={handleChange} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Middle Name</Label>
                                    <Input type="text" name="mname" value={formData.mname} onChange={handleChange} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="email" >Email Address</Label>
                                    <Input 
                                        type="email"
                                        error={staffEmailError}
                                        id="email"
                                        name="email"
                                        onChange={handleStaffEmailChange}
                                        placeholder="Enter your email"
                                        hint={staffEmailError ? "This is an invalid email address." : ""}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="phone" >Phone</Label>
                                    <Input id="phone" type="text" name="phone" onChange={handleChange} value={formData.phone} />
                                </div>
                            </div>

                        </div>

                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Basic Data
                            </h5>

                            <div className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
    
                                <div className="col-span-2  lg:col-span-1">
                                    <Label htmlFor="nat_id" >National Identification</Label>
                                    <Input id="nat_id" type="number" name="nat_id" onChange={handleChange} value={formData.nat_id} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="weekly_hours" >Weekly Hours</Label>
                                    <Input id="weekly_hours" type="text" name="weekly_hours" onChange={handleChange} value={formData.weekly_hours} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="gender" >Gender</Label>
                                    <Select
                                        options={genderoptions}
                                        placeholder = "Select your gender"
                                        onChange={(gender) => handleSelectChange(gender, "gender")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <DatePicker
                                        id="dob"
                                        label="Date of Birth"
                                        placeholder="Select a date"
                                        onChange={(date, currentDateString) => {
                                            handleDateChange(currentDateString, "dob")
                                            console.log({ date, currentDateString });
                                        }}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="branch" >Branch</Label>
                                    <Select
                                        options={branches}
                                        placeholder = "Select a branch"
                                        onChange={(branch) => handleSelectChange(branch, "branch")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        options={departments}
                                        placeholder = "Select a department"
                                        onChange={(department) => handleSelectChange(department, "department")}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button 
                        type="button" 
                        onClick={nextStep}
                        className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                        Next
                    </button>
                </div>
                </>
            )}

            {step === 2 && (
                <>
                {/* Section B: Application Details */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Biometrics
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2">
                                    <Label>Passport</Label>
                                    <FileInput onChange={(e) => handleFileChange(e, "passport")} />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Section C: Submission Button */}
                <div className="flex justify-between mt-6">
                    <button 
                        type="button" 
                            onClick={prevStep}
                            className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                        Previous
                    </button>

                    <button
                        disabled={submitting}
                        type="submit"
                        className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                </div>

                </>
            
            )}
        </form>
    );
}

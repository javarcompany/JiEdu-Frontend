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
    dob: string;
    nat_id: string;
    phone: string;
    email: string;
    course: string;
    branch: string;
    year: string;
    intake: string;
    sponsor: string;
    religion: string;
    phy_addr: string;
    home_addr: string;
    guardian_fname: string;
    guardian_lname: string;
    guardian_phone: string;
    guardian_email: string;
    guardian_relationship: string;
    examtype: string;
    examyear: string;
    prev_schoolname: string;
    examgrade: string;
    previousexams: File | null;
    passport: File | null;
}
  
export default function RegistrationForm() {
    const token = localStorage.getItem("access");

    const navigate = useNavigate();

    const [email, setStudentEmail] = useState("");
    const [studentEmailError, setStudentEmailError] = useState(false);

    const [guardian_email, setGuardianEmail] = useState("");
    const [guardianEmailError, setGuardianEmailError] = useState(false);

    const [examtypes, setExamTypes] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [guardianoptions, setGuardianOptions] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [genderoptions, setGenders] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [courses, setCourses] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [branches, setBranches] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [academicyears, setYears] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [intakes, setIntakes] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [sponsors, setSponsors] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchGenders = async () => {
            axios.get('/api/genders/?all=true',
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

        const fetchRelationships = async () => {
            axios.get('/api/relationship-choices/?all=true',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                setGuardianOptions(response.data);
            })
            .catch(error => {
                console.error("Error fetching relationship choices:", error);
            });
        };

        const fetchExamTypes = async () => {
            axios.get('/api/exam-choices/?all=true',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                setExamTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching exam choices:", error);
            });
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                console.log("Courses: ", data)
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

        const fetchBranches = async () => {
            try {
                const response = await axios.get("/api/branches/?all=true",
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

        const fetchYears = async () => {
            try {
                const response = await axios.get("/api/academic-year/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert academic years to the format expected by SearchableSelect
                const formatted = data.map((acyear : any) => ({
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
                const response = await axios.get("/api/intakes/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert intakes to the format expected by SearchableSelect
                const formatted = data.map((intake : any) => ({
                    value: intake.id.toString(),
                    label: intake.name,      
                }));
                
                setIntakes(formatted);
                } catch (error) {
                console.error("Failed to load Intakes", error);
            }
        };

        const fetchSponsors = async () => {
            try {
                const response = await axios.get("/api/sponsors/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert sponsors to the format expected by SearchableSelect
                const formatted = data.map((sponsor : any) => ({
                    value: sponsor.id.toString(),
                    label: sponsor.name,      
                }));
                
                setSponsors(formatted);
                } catch (error) {
                console.error("Failed to load Sponsors", error);
            }
        };

        fetchGenders();
        fetchRelationships();
        fetchExamTypes();
        fetchCourses();
        fetchBranches();
        fetchYears();
        fetchIntakes();
        fetchSponsors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // console.log(name, ":", value)
    };

    const validateEmail = (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    
    const handleStudentEmailChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setStudentEmail(value);
        setStudentEmailError(!validateEmail(value));
        setFormData((prev) => ({ ...prev, email: value }));
        // console.log("Students Email:", value)
    };
    
    const handleGuardianEmailChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setGuardianEmail(value);
        setGuardianEmailError(!validateEmail(value));
        setFormData((prev) => ({ ...prev, guardian_email: value }));
        // console.log("Guardian's Email:", value)
    };

    const handleSelectChange = (option: any, field: string) => {
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

    const [formData, setFormData] = useState<FormDataState>({
        regno: "", fname: "", mname: "", sname: "", gender: "",
        dob: "", nat_id: "", phone: "", email: "", course: "",
        branch: "", year: "", intake: "", sponsor: "", religion: "",
        phy_addr: "", home_addr: "", guardian_fname: "", guardian_lname: "",
        guardian_phone: "", guardian_email: "", guardian_relationship: "",
        examtype: "", examyear: "", prev_schoolname: "", examgrade: "",
        previousexams: null, passport: null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we submit the application.",
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
            const res = await fetch("/api/applications/", {
                method: "POST",
                body: form, 
                headers: {
                            Authorization: `Bearer ${token}`,
                        },
            });

            Swal.close()

            if (res.ok) {
                Swal.fire("Success", "Student registered successfully", "success");
                setFormData({
                    regno: "", fname: "", mname: "", sname: "", gender: "",
                    dob: "", nat_id: "", phone: "", email: "", course: "",
                    branch: "", year: "", intake: "", sponsor: "", religion: "",
                    phy_addr: "", home_addr: "", guardian_fname: "", guardian_lname: "",
                    guardian_phone: "", guardian_email: "", guardian_relationship: "",
                    examtype: "", examyear: "", prev_schoolname: "", examgrade: "",
                    previousexams: null, passport: null,
                });

                navigate("/student-list")
            } else {
                const errorData = await res.json();
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

    // DEBUG:
    // console.log("Form Data: ", formData)
    console.log("Students' Email: ", email)
    console.log("Guardian's Email: ", guardian_email)
    // console.log("Guardian options: ", genderoptions)

    // console.log("Courses: ", courses)
    // console.log("Branches: ", branches)
    // console.log("Academic Years: ", academicyears)
    // console.log("Intakes: ", intakes)
    // console.log("Sponsors: ", sponsors)

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

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="fname" >First Name</Label>
                                    <Input id="fname" type="text" name="fname" value={formData.fname} onChange={handleChange} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="sname" >Last Name</Label>
                                    <Input id="sname" type="text" name="sname" onChange={handleChange} value={formData.sname} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="mname" >Middle Name</Label>
                                    <Input id="mname" type="text" name="mname" onChange={handleChange} value={formData.mname} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="nat_id" >National Identification</Label>
                                    <Input id="nat_id" type="number" name="nat_id" onChange={handleChange} value={formData.nat_id} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="email" >Email Address</Label>
                                    <Input 
                                        type="email"
                                        error={studentEmailError}
                                        id="email"
                                        name="email"
                                        onChange={handleStudentEmailChange}
                                        placeholder="Enter your email"
                                        hint={studentEmailError ? "This is an invalid email address." : ""}
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
                                Address
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                                        id="id_dob"
                                        label="Date of Birth"
                                        placeholder="Select Date of Birth"
                                        onChange={(date, currentDateString) => {
                                            handleDateChange(currentDateString, "dob")
                                            console.log({ date, currentDateString });
                                        }}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="religion" >Religion</Label>
                                    <Input id="religion" type="text" name="religion" onChange={handleChange} value={formData.religion} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="home_addr" >Home Address</Label>
                                    <Input id="home_addr" type="text" name="home_addr" onChange={handleChange} value={formData.home_addr} />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="phy_addr" >Physical Address</Label>
                                    <Input id="phy_addr" type="text" name="phy_addr" onChange={handleChange} value={formData.phy_addr} />
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
                {/* Section B: Guardian Information/ Previous School Info */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Guardian's Information
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="guardian_fname" >First Name</Label>
                                    <Input id="guardian_fname" type="text" name="guardian_fname" onChange={handleChange} value={formData.guardian_fname} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="guardian_lname" >Last Name</Label>
                                    <Input id="guardian_lname" type="text" name="guardian_lname" onChange={handleChange} value={formData.guardian_lname} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="guardian_email" >Email Address</Label>
                                    <Input 
                                        type="email"
                                        id="guardian_email"
                                        name="guardian_email"
                                        error={guardianEmailError}
                                        onChange={handleGuardianEmailChange}
                                        placeholder="Enter your email"
                                        hint={guardianEmailError ? "This is an invalid email address." : ""}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="guardian_phone" >Phone</Label>
                                    <Input id="guardian_phone" type="text" name="guardian_phone" onChange={handleChange} value={formData.guardian_phone} />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="guardian_relationship" >Relationship</Label>
                                    <Select
                                        options={guardianoptions}
                                        placeholder = "Select relationship"
                                        onChange={(goption) => handleSelectChange(goption, "guardian_relationship")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Previous School
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="examtype">Exam type</Label>
                                    <Select
                                        options={examtypes}
                                        placeholder = "Select exam type"
                                        onChange={(examtype) => handleSelectChange(examtype, "examtype")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="examyear">Year</Label>
                                    <Input id="examyear" type="text" name="examyear" onChange={handleChange} value={formData.examyear} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="prev_schoolname" >School</Label>
                                    <Input id="prev_schoolname" type="text" name="prev_schoolname" onChange={handleChange} value={formData.prev_schoolname} />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="examgrade" >Grade</Label>
                                    <Input id="examgrade" type="text" name="examgrade" onChange={handleChange} value={formData.examgrade} />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="previousexams">Document</Label>
                                    <FileInput onChange={(e) => handleFileChange(e, "previousexams")} />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button 
                        type="button" 
                        onClick={prevStep}
                        className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                        Previous
                    </button>

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

            {step === 3 && (
                <>
                {/* Section C: Application Details */}
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Course Details
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="branch" >Branch</Label>
                                    <Select
                                        options={branches}
                                        placeholder = "Select a branch"
                                        onChange={(branch) => handleSelectChange(branch, "branch")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="course">Course</Label>
                                    <Select
                                        options={courses}
                                        placeholder = "Select a course"
                                        onChange={(course) => handleSelectChange(course, "course")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="year">Year</Label>
                                    <Select
                                        options={academicyears}
                                        placeholder = "Select a year"
                                        onChange={(acyear) => handleSelectChange(acyear, "year")}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label htmlFor="intake">Intake</Label>
                                    <Select
                                        options={intakes}
                                        placeholder = "Select a intake"
                                        onChange={(intake) => handleSelectChange(intake, "intake")}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Sponsor</Label>
                                    <Select
                                        options={sponsors}
                                        placeholder = "Select sponsor"
                                        onChange={(sponsor) => handleSelectChange(sponsor, "sponsor")}
                                    />
                                </div>
                            </div>

                        </div>

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

                {/* Section D: Submission Button */}
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

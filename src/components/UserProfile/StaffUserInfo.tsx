import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useUser } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

interface Applicant {
    id: string;
    name: string;
    department: string;
    national_id: string;
    phone: string;
    email: string;
    weekly_hours: string;
}

export default function StaffUserInfo() {
    const { isOpen, openModal, closeModal } = useModal();
    const { user } = useUser();
    const [staff, setStaff] = useState<Applicant>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`/api/staff-primary-course-data/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                        params :{staff_regno: user?.regno}
                    }
                );
                setStaff(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch Application form", error);
                setLoading(false);
            }
        };
        
        fetchApplication();
    },[submitting]);

    const handleSave = () => {
        setSubmitting(!submitting);
        closeModal();
    };

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Loading staff data...</div>;
    }

    return (
        <div className="p-5 mx-4 mb-4 border border-gray-200 border-t-4 border-t-blue-500 dark:border-t-blue-500 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-row gap-6 lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        {staff?.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                National ID
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.national_id}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Phone
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.phone}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Weekly Hours
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.weekly_hours} Hrs
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Email
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Department
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {staff?.department}
                            </p>
                        </div>

                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
            
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Personal Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your profile up-to-date.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Social Links
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Facebook</Label>
                                        <Input
                                            type="text"
                                            value="https://www.facebook.com/javarcompany"
                                        />
                                    </div>

                                    <div>
                                    <Label>X.com</Label>
                                    <Input type="text" value="https://x.com/javarcompany" />
                                    </div>

                                    <div>
                                    <Label>Github</Label>
                                    <Input
                                        type="text"
                                        value="https://www.github.com/javarcompany"
                                    />
                                    </div>

                                    <div>
                                    <Label>Instagram</Label>
                                    <Input type="text" value="https://instagram.com/javarcompany" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                    <Label>First Name</Label>
                                    <Input type="text" value="Javar Intelligent" />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                    <Label>Last Name</Label>
                                    <Input type="text" value="Education System" />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                    <Label>Email Address</Label>
                                    <Input type="text" value="jiedu@javarcompany.co.ke" />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                    <Label>Phone</Label>
                                    <Input type="text" value="+254 790 671 205" />
                                    </div>

                                    <div className="col-span-2">
                                    <Label>Bio</Label>
                                    <Input type="text" value="System Administrator" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

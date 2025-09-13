import ImageBannerBox from "../../../components/ui/Banner";
import { FolderEditIcon, WeightIcon } from "lucide-react";
import { useNavigate } from "react-router";
import WorkloadPreview from "./WorkloadPreview";
import LineShadedChart from "../../../components/ui/reports/LineShadedCharts";
import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import MarkRegister from "./AttendanceModal";
import { useUser } from "../../../context/AuthContext";
import axios from "axios";
import UserStack from "../../../components/UserProfile/UserList";
import { User } from "../../../components/UserProfile/StaffProfileDashboard";

export default function LeftComponents() {
	const navigate = useNavigate();
    const token = localStorage.getItem("access");
    const { isOpen, openModal, closeModal } = useModal();
    const { user } = useUser();

    const [lessons, setLessons] = useState<[]>([]);
    const [register_values, setRegValues] = useState<[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/fetch-staffmates/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { staff_regno: user?.regno }  // replace with actual regno
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect( () => {
        const fetchAttendanceTrend = async () => {
            const resp_data = await axios.get(`/api/lecturer-lesson-analysis/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { staff_regno: user?.regno },
            });
            setLessons(resp_data.data.lessons);
            setRegValues(resp_data.data.reg_values);
        }
        
        fetchAttendanceTrend();
    }, [token, user?.regno]);

    const onSubmit = () => {
		closeModal();
	}
    
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <ImageBannerBox
                        height={200}
                        title={`Welcome ${user?.user_full_name}`}
                        subtitle="Your all in one college management information system"
                        
                        action1Label="Mark Register"
                        startIcon1={<FolderEditIcon />}
                        onAction1Click={openModal}

                        action2Label="Workload"
                        startIcon2={<WeightIcon />}
                        onAction2Click={() => navigate("/workload")}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <WorkloadPreview />
                </div>
                <div className="col-span-12 md:col-span-6 rounded-lg">
                    <LineShadedChart title="Attendance Trend" categories={lessons} seriesData={register_values} />
                </div>
                <div className="col-span-12">
                    <UserStack users={users} />
                </div>
            </div>
            
            <Modal isOpen={isOpen} onClose={onSubmit} className="max-w-[700px] w-full m-4">
                <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11 max-h-[95vh] overflow-hidden">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Mark Attendance
                        </h4>
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 lg:mb-2">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    {/* Scrollable content */}
                    <div className="px-6 py-2">
                        <MarkRegister onSubmit={onSubmit} />
                    </div>
                    
                </div>
            </Modal>
        </>
    )
}
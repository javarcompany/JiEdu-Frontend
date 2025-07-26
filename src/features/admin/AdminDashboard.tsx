import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { ClickableStatCard } from "../../components/dashboard/StartCard";

import { 
    AdminIcon, GroupIcon, School2Icon, 
    School1Icon, CourseIcon, UnitIcon, 
    ClassroomIcon, StudentIcon, TeacherMale1Icon,
    Admin1Icon, TeacherIcon, Student2Icon
} from "../../icons";

import { CameraIcon, UsersRoundIcon } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";


import Button from "../../components/ui/button/Button";
import AdminGroups from "./AdminGroups"
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { ClickableCard } from "../../components/dashboard/ClickButton";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

import { formatStudentCount } from "../../components/ecommerce/EcommerceMetrics";

const availableIcons = [
    { name: "StudentIcon", icon: <StudentIcon /> },
    { name: "TeacherMale1Icon", icon: <TeacherMale1Icon /> },
    { name: "TeacherIcon", icon: <TeacherIcon /> },
    { name: "Admin1Icon", icon: <Admin1Icon /> },
    { name: "Student2Icon", icon: <Student2Icon /> },
];

export default function AdminDashboard(){
    const token = localStorage.getItem("access");
    const [groupName, setGroupName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");
    
    const [usersCount, setUsersCount] = useState(0);

    const { isOpen, openModal, closeModal } = useModal();

    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!groupName || !selectedIcon) {
            closeModal();
            Swal.fire( "Missing Data", "Group name and icon are required.","warning");
            return;
        }

        try {
            console.log(groupName, selectedIcon)
            const response = await axios.post("/api/groups/", 
                {
                group_name: groupName,
                icon: selectedIcon,
                },
                {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            Swal.fire("Group Created", `Group "${response.data.group_name}" created successfully!`,"success");
    
            setGroupName("");
            setSelectedIcon("");
            closeModal();
        } catch (error) {
            setGroupName("");
            setSelectedIcon("");
            closeModal();
            console.error(error);
            Swal.fire("Error", "Failed to create group. Please try again.", "error");
        }
    };

    useEffect(() => {
    
        const fetchUserCount = async () => {
            try {
                const response = await axios.get("/api/users_count/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUsersCount(response.data.count);
            } catch (error) {
                console.error("Failed to fetch users count:", error);
            }
        };
        fetchUserCount();
    }, []);
    
    return (
        <>
            <PageMeta
                title="JiEdu Dashboard | Admin Page"
                description="Admin Page for JiEdu Application making the system's configurations"
            />

            <div className="grid grid-cols-12 gap-2">
                            
                <div className="col-span-12 xl:col-span-3">
                    <div className="col-span-12 py-2">
                        <Button
                            onClick={openModal}
                            size="sm"
                            variant="outline"
                            startIcon={<GroupIcon className="size-5" />}
                        >
                            Add Group
                        </Button>
                    </div>
                    
                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableStatCard
                            title="Configs"
                            value=""
                            percentageChange="-14%"
                            contextText="School Settings"
                            classvalue="bg-red-900 dark:text-white-900 text-white"
                            icon={<AdminIcon className="w-5 h-5" />}
                            href="/configs"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableStatCard
                            title="Users"
                            value={formatStudentCount(usersCount)}
                            percentageChange="Active"
                            contextText="Users"
                            classvalue="bg-green-900 dark:text-white-900 text-white"
                            icon={<UsersRoundIcon className="w-5 h-5" />}
                            href="/users"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableStatCard
                            title="Cameras"
                            value={formatStudentCount(usersCount)}
                            percentageChange="Active"
                            contextText="Cameras"
                            classvalue="bg-green-900 dark:text-white-900 text-white"
                            icon={<CameraIcon className="w-5 h-5" />}
                            href="/cameras"
                        />
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <AdminGroups />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    
                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableStatCard
                            title="Branches"
                            value="5"
                            percentageChange="+44%"
                            contextText="Active Branches"
                            classvalue="bg-green-900 dark:text-white-900 text-white"
                            icon={<School2Icon className="w-5 h-5" />}
                            href="/branches"
                        />
                    </div>
                    
                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableCard
                            title="Departments"
                            contextText = ""
                            icon = {<School1Icon className="w-8 h-8" />}
                            href = "/departments"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableCard
                            title="Courses"
                            contextText = ""
                            icon = {<CourseIcon className="w-8 h-8" />}
                            href = "/courses"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableCard
                            title="Units"
                            contextText = ""
                            icon = {<UnitIcon className="w-8 h-8" />}
                            href = "/units"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableCard
                            title="Classes"
                            contextText = ""
                            icon = {<GroupIcon className="w-6 h-6" />}
                            href = "/classes"
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-12 py-2">
                        <ClickableCard
                            title="Classrooms"
                            contextText = ""
                            icon = {<ClassroomIcon className="w-8 h-8" />}
                            href = "/classrooms"
                        />
                    </div>
                </div>

            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Group
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Add a Group of Users within the system.
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleAddGroup}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Icon</Label>
                                    <div className="grid grid-cols-5 gap-4 p-4 rounded-xl shadow">
                                        {availableIcons.map((item) => (
                                            <button
                                                type="button"
                                                key={item.name}
                                                onClick={() => setSelectedIcon(item.name)}
                                                className={`p-2 border rounded-lg flex items-center justify-center
                                                    transition-colors hover:border-blue-500 ${
                                                        selectedIcon === item.name
                                                            ? "border-blue-500 bg-blue-100 dark:bg-blue-800"
                                                            : "border-gray-300"
                                                    }`}
                                            >
                                                {item.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label>Group Name</Label>
                                    <Input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm">
                                Add Group
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>


        </>
    )
};
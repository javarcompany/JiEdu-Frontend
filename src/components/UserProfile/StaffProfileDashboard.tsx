import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import UserCard from "../../features/users/UserCard";
import UserStack from "./UserList";
import axios from "axios";
import { useUser } from "../../context/AuthContext";
import PasswordChange from "./ChangePassword";

export type User = {
    id: number;
    name: string;
    regno: string;
    passport: string;
    dob: string;
    branch: string;
    location: string;
    phone: string;
    email: string;
};

export default function StaffProfileDashboard() {
    const token = localStorage.getItem("access");
    const {user} = useUser();
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

    return (
        <>
            <PageMeta
                title="JiEdu Profile | User Profile Page"
                description="User Profile Page for JiEdu Application making the system's configurations"
            />

                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 xl:col-span-3">
                        <UserCard />
                    </div>

                    <div className="col-span-12 xl:col-span-9">
                        {/* <StudentUserInfo /> */}
                        <PasswordChange />
                        <UserStack users={users} />
                    </div>

                </div>
        </>
    )
}
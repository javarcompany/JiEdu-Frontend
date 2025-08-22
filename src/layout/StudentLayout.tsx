import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import StudentSidebar from "./StudentSidebar";
import { useEffect } from "react";
import axios from "axios";

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const token = localStorage.getItem("access");

    useEffect(() => {
		const fetchStudent = async () => {
            try {
                const response = await axios.get("/api/search-student-primary/",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

			    localStorage.setItem("student_id", response.data.student_id);
			    localStorage.setItem("user_id", response.data.user_id);

            } catch (error) {
                console.error("Failed to fetch student:", error);
            }
        };

		fetchStudent();
    }, []);

    return (
        <div className="min-h-screen xl:flex">
            <div>
                <StudentSidebar />
                <Backdrop />
            </div>

            <div className={`flex-1 transition-all duration-300 ease-in-out ${ isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]" } ${isMobileOpen ? "ml-0" : ""}`}>
                <AppHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const StudentLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default StudentLayout;

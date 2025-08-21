import { Users, BookOpen, DollarSign, FileText, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const adminButtons = [
    { title: "Students", icon: <Users className="w-8 h-8" />, back: "Manage student records", color: "bg-blue-500 hover:bg-blue-900", link: "/student" },
    { title: "Courses", icon: <BookOpen className="w-8 h-8" />, back: "View and edit courses", color: "bg-green-500 hover:bg-green-900", link: "/units" },
    { title: "Attendance", icon: <FileText className="w-8 h-8" />, back: "View registers", color: "bg-purple-500 hover:bg-purple-900", link: "/timetable" },
    { title: "Finance", icon: <DollarSign className="w-8 h-8" />, back: "Handle payments", color: "bg-yellow-500 hover:bg-yellow-900", link: "/fee-report" },
    { title: "Timetable", icon: <Calendar className="w-8 h-8" />, back: "Schedule classes", color: "bg-pink-500 hover:bg-pink-900", link: "/timetable" },
    { title: "Settings", icon: <Settings className="w-8 h-8" />, back: "System preferences", color: "bg-gray-500 hover:bg-gray-900", link: "/admin" },
];

export default function AdminButtons() {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-3">
            {adminButtons.map((btn, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(`${btn.link}`)}
                    className={`${btn.color} flex flex-col items-center justify-center p-6 rounded-2xl shadow-md text-white font-semibold hover:scale-110 transition-all duration-200`}
                    style={{ aspectRatio: "1 / 1" }} // makes them perfect squares
                >
                    {btn.icon}
                    <span className="mt-3 text-lg">{btn.title}</span>
                </button>
            ))}
        </div>
    );
}

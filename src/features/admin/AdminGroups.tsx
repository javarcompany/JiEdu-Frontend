import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { StudentIcon, TeacherMale1Icon,
    Admin1Icon, TeacherIcon, Student2Icon,
} from "../../icons";

import {  Pencil, Trash2, Settings, LucideUsers2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import axios from "axios";

interface Groups {
    id: number;
    icon?: string;
    group: string;
    group_name: string;
}

const iconMap: Record<string, JSX.Element> = {
    StudentIcon: <StudentIcon className="w-full h-full bg-white" />,
    TeacherIcon: <TeacherIcon className="w-full h-ful bg-white" />,
    Admin1Icon: <Admin1Icon className="w-full h-full bg-white" />,
    Student2Icon: <Student2Icon className="w-full h-full bg-white" />,
    TeacherMale1Icon: <TeacherMale1Icon className="w-full h-full bg-white" />,
};

export default function AdminGroups() {
    const token = localStorage.getItem("access");
    
    const [groups, setGroups] = useState<Groups[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleManageRoles = (group: Groups) => {
        const groupName = group.group_name
        const groupID = group.id
		navigate(`/manage-roles/${encodeURIComponent(groupName)}/${encodeURIComponent(groupID)}`);
	};

    const handleManageMembers = (group: Groups) => {
        const groupName = group.group_name
        const groupID = group.id
		navigate(`/manage-members/${encodeURIComponent(groupName)}/${encodeURIComponent(groupID)}`);
	};

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    "/api/groups/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setGroups(response.data.results);
                console.log(response.data.results)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
        const interval = setInterval(fetchGroups, 2000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
            <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                    Group
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                    Roles
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                    Members
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                    Action(s)
                </TableCell>
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {groups.map((group) => (
                    <TableRow key={group.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 overflow-hidden rounded-full bg-transparent flex items-center justify-center shadow-sm">
                                    {group.icon && iconMap[group.icon]}
                                </div>
                                <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {group.group_name}
                                    </span>
                                </div>
                            </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex items-center gap-3">
                                <button
                                    title="Manage Roles"
                                    className="text-blue-500 hover:text-red-600 transition-colors"
                                    onClick={() => handleManageRoles(group)}
                                >
                                    <Settings size={16} />
                                </button>
                            </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex -space-x-2">
                                <button
                                    title="Manage Members"
                                    className="text-warning-500 hover:text-blue-600 transition-colors"
                                    onClick={() => handleManageMembers(group)}
                                >
                                    <LucideUsers2 size={26} />
                                </button>
                            </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            <button
                                title="Edit Group"
                                className="text-green-500 hover:text-green-600 transition-colors"
                                onClick={() => console.log("Edit", group.group)}
                            >
                                <Pencil size={16} />
                            </button>

                            <button
                                title="Delete Group"
                                className="text-red-500 hover:text-red-600 transition-colors  px-4"
                                onClick={() => console.log("Delete", group.group)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}

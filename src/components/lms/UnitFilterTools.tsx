import { useEffect, useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { SearchButton } from "../dashboard/SearchButton";
import axios from "axios";
import DictSearchableSelect_Avatar from "../form/DictAvatarSelect";

interface SelectionOption{
    value: string;
    label: string;
    image: string;
}

export default function UnitFilterToolbar(
    {onSearch, layout, onLayoutChange, onCourseChange, onModuleChange, onRatingChange,}: 
    {onSearch: (value: string) => void, layout: "grid" | "list"; onLayoutChange: (value: "grid" | "list") => void;   onCourseChange: (courseId: string) => void; onModuleChange: (moduleId: string) => void; onRatingChange: (rating: string) => void;}
) {
    const token = localStorage.getItem("access");
    const [courses, setCourses] = useState<SelectionOption[]>([]);
    const [modules, setModules] = useState<SelectionOption[]>([]);
    const [ratings] = useState<SelectionOption[]>([
        { value: "5", label: "5 Stars", image: "" },
        { value: "4", label: "4 Stars", image: "" },
        { value: "3", label: "3 Stars", image: "" },
        { value: "2", label: "2 Stars", image: "" },
        { value: "1", label: "1 Stars", image: "" },
    ]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`/api/courses/?all=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((course: any) => ({
                    value: course.abbr.toString(),
                    label: course.name
                }));
                setCourses(formatted);
            } catch (error) {
                console.error("Failed to load wallets", error);
            }
        };

        const fetchModules = async () => {
            try {
                const response = await axios.get(`/api/modules/?all=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const formatted = response.data.results.map((module: any) => ({
                    value: module.abbr.toString(),
                    label: module.name
                }));
                setModules(formatted);
            } catch (error) {
                console.error("Failed to load wallets", error);
            }
        };

        fetchCourses();
        fetchModules();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full pt-4 bg-white dark:bg-gray-900 rounded-sm"
        >
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                {/* Search */}
                <div className="w-full">
                    <SearchButton onSearch={onSearch} />
                </div>

                {/* Course Select */}
                <div className="w-full">
                    <DictSearchableSelect_Avatar
                        items={courses}
                        placeholder="Select Course.."
                        onSelect={(value) => onCourseChange(value || "")}
                    />
                </div>

                {/* Module Select */}
                <div className="w-full flex gap-2">
                    <DictSearchableSelect_Avatar
                        items={modules}
                        placeholder="Select Module"
                        onSelect={(val) => onModuleChange(val || "")}
                    />

                    <DictSearchableSelect_Avatar
                        items={ratings}
                        placeholder="Select Rating"
                        onSelect={(val) => onRatingChange(val || "")}
                    />

                    {/* Toggle Buttons */}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => onLayoutChange("grid")}
                            className={`p-2 rounded-md border ${
                            layout === "grid"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => onLayoutChange("list")}
                            className={`p-2 rounded-md border ${
                            layout === "list"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                    
                </div>
            </div>
        </motion.div>
    );
}

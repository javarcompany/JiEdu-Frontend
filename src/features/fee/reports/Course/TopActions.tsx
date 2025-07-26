import { useEffect, useState } from "react";
import axios from "axios";
import DictSearchableSelect from "../../../../components/form/DictSelect";

interface SelectionOption{
    value: string;
    label: string;
    image: string;
}

type ActionsProps = {
    filters: { course_abbr: string; course: string, term:string; };
    setFilters: React.Dispatch<React.SetStateAction<{ course_abbr: string;  course: string, term:string; }>>;
};

export default function TopAction({ filters, setFilters }: ActionsProps){

    const token = localStorage.getItem("access");
    const [courseoptions, setCourseOptions] = useState<SelectionOption[]>([]);
    const [terms, setTerms] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

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
                    value: course.id.toString(),
                    label: course.name + " - " + course.code,
                }));
                setCourseOptions(formatted);
            } catch (error) {
                console.error("Failed to load course", error);
            }
        };

        fetchCourses();

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/?range=1", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.results.map((term: any) => ({
                    value: term.id.toString(),
                    label: term.termyear,
                }));
                setTerms(formatted);
            } catch (error) {
                console.error("Failed to load intakes", error);
            }
        };

        fetchTerms();

    }, []);

    return (
        <div className="w-full flex flex-row gap-6 items-start p-4">
            
            <DictSearchableSelect
                items={terms}
                placeholder="Select Term..."
                onSelect={(val) => {
                    setFilters({ ...filters, term: val });
                }}
            />

            <DictSearchableSelect 
                items={courseoptions}
                placeholder="Select Course.."
                onSelect={(value) => {
                    setFilters({ ...filters, course: value });
                }}
            />
        </div>
    );

}
import { FileTextIcon, ImageIcon, MusicIcon, VideoIcon } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import MediaInfoCard from "../../components/lms/MediaInfo";
import UnitCard from "../../components/lms/UnitCard";
import UnitFilterToolbar from "../../components/lms/UnitFilterTools";
import { useEffect, useState } from "react";
import Pagination from "../../components/ui/pagination";
import debounce from "lodash.debounce";
import axios from "axios";
import { Units } from "../units/UnitsTable";
import UnitListRow from "../../components/lms/UnitList";
import Swal from "sweetalert2";

interface Content {
    name: string;
    quantity: string;
    percentage: string;
    fileSize: string;
}

interface ContentType {
    images: Content;
    video: Content;
    documents: Content;
    audio: Content;
}

export default function AdminLMSashboard() {
    const token = localStorage.getItem("access");
    const [units, setUnits] = useState<Units[]>([]);
    const [statistics, setStatistics] = useState<ContentType>();
    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("");
    const [module, setModule] = useState("");
    const [rating, setRating] = useState("");

	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
    
    const [layout, setLayout] = useState<"grid" | "list">("grid");

    
    const LMSButtons = [
        { title: "Images", icon: ImageIcon, iconColor: "text-pink-500", glowColor: "shadow-pink-300", borderColor: "border-pink-300", fileCount: 300, usagePercentage: 15, fileSize: "20.54GB" },
        { title: "Audio", icon: MusicIcon, iconColor: "text-green-500", glowColor: "shadow-green-300", borderColor: "border-green-300", fileCount: 120, usagePercentage: 35, fileSize: "10.2GB" },
        { title: "Video", icon: VideoIcon, iconColor: "text-purple-500", glowColor: "shadow-purple-300", borderColor: "border-purple-300", fileCount: 89, usagePercentage: 55, fileSize: "50.7GB" },
        { title: "Documents", icon: FileTextIcon, iconColor: "text-red-500", glowColor: "shadow-red-500", borderColor: "border-red-500", fileCount: 120, usagePercentage: 10, fileSize: "27.7GB" },
    ];

    const buildQuery = () => {
        return [search, course, module, rating]
        .filter(Boolean)
        .join(" ");
    };

    const fetchUnits = debounce(async (query: string, page = 1, pageSize = 6) => {
		try {
            const params = new URLSearchParams();
            if (query) params.append("search", query);
            params.append("page", page.toString());
            params.append("page_size", pageSize.toString());

			const response = await axios.get(`/api/units/?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUnits(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Units", error);
			setLoading(false);
		}
	}, 100);

    const fetchContentType = debounce(async () => {
		try {
			const response = await axios.get(`/api/contents-statistics/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStatistics(response.data.results);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch media statistics", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
        const query = buildQuery();
		fetchUnits(query, page);
	},[token, search, course, module, rating, page]);

    const handleTogglePublish = async (unitId: number) => {
        try {
            const response = await axios.put( `/api/unit/toggle-publish/`, {}, { 
                    headers: { Authorization: `Bearer ${token}` }, 
                    params: {unitid: unitId}
                }
            );
            if (response?.data.error){
                Swal.fire({
                    icon: "error",
                    title: "Error", 
                    text: response.data.error,
                });
            }
            
            if (response.data.success){
                Swal.fire({
                    icon: "success",
                    title: "Success", 
                    text: response.data.success,
                });
            }
            // Refresh units after toggling
            fetchUnits(buildQuery(), page);
        } catch (err) {
            console.error("Failed to toggle publish", err);
        }
    };
    
    return (
        <>
            <PageMeta
                title="JiEdu LMS Dashboard | Learning Management System Page"
                description="LMS Page for JiEdu Application showing courses in the system"
            />

            <div className="space-y-4">
                <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {LMSButtons.map((btn) => (
                        <MediaInfoCard
                            icon={btn.icon}
                            iconColor={btn.iconColor}
                            glowColor={btn.glowColor}
                            borderColor={btn.borderColor}
                            title={btn.title}
                            filesCount={btn.fileCount}
                            usagePercent={btn.usagePercentage}
                            fileSize={btn.fileSize}
                        />
                    ))}
                </div>
                
                <UnitFilterToolbar 
                    layout={layout} 
                    onLayoutChange={setLayout} 
                    onSearch={(val) => setSearch(val)}
                    onCourseChange={(val) => setCourse(val)}
                    onModuleChange={(val) => setModule(val)}
                    onRatingChange={(val) => setRating(val)}
                />

                {layout === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="p-4 text-sm text-gray-500">Loading units...</div>
                        ) : (
                        units.length === 0 ? (
                            <div className="p-4 text-md text-white bg-red-600 rounded-md">
                                No unit found...!
                            </div>
                        ) : (
                        units.map((unit, i) => (
                            <UnitCard
                                key={i}
                                unitId={unit.id}
                                image="https://via.placeholder.com/150"
                                title={unit.name}
                                rating={unit.rating || 0}
                                isPublished={unit.is_published}
                                onTogglePublish={() => handleTogglePublish(unit.id)}
                                totalTopics={unit.total_topics}
                                course={unit.course_name}
                                module={unit.module_name}
                                publishedOn={unit.dor}
                                updatedOn={unit.dor}
                                unitCode={unit.uncode}
                                abbreviation={unit.abbr}
                            />
                        ))))}
                    </div>
                ) : (
                    <div className="gap-8">
                        {loading ? (
                            <div className="p-4 text-sm text-gray-500">Loading units...</div>
                        ) : (
                        units.length === 0 ? (
                            <div className="p-4 text-md text-center text-white bg-red-600 rounded-md">
                                No unit found...!
                            </div>
                        ) : (
                        units.map((unit, i) => (
                            <UnitListRow
                                key={i}
                                unitId={unit.id}
                                image="https://via.placeholder.com/150"
                                title={unit.name}
                                rating={unit.rating || 0}
                                isPublished={unit.is_published}
                                onTogglePublish={() => handleTogglePublish(unit.id)}
                                course={unit.course_name}
                                module={unit.module_name}
                                publishedOn={unit.dor}
                                updatedOn={unit.dor}
                                unitCode={unit.uncode}
                                abbreviation={unit.abbr}
                            />
                        ))))}
                    </div>
                )}

                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </>
    );
}

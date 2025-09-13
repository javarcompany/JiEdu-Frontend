import PageMeta from "../../components/common/PageMeta";
import TopicView from "../../components/lms/TopicsRead";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function TopicDashboard() {
    const token = localStorage.getItem("access");
	const { unitid } = useParams<{ unitid: string }>();
	const [unitData, setUnitData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!unitid) {
			setError("No Unit ID provided.");
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				const res = await axios.get(
					`/api/lms/unit/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
						params: {
							unitId: unitid
						}
					}
				);

				setUnitData(res.data);
			} catch (err: any) {
				setError("Failed to fetch unit data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [unitid]);

	useEffect(() => {
		if (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: error,
			});
		}
	}, [error]);

	return (
		<>
			<PageMeta
				title="JiEdu LMS Dashboard | Topics Page"
				description="LMS Page for JiEdu Application showing courses in the system"
			/>

			<div className="col-span-12">
				{/* ✅ Show API data if available */}
				{!loading && unitData && !error ? (
					<TopicView
						name={unitData.name}
						description={unitData.description}
						welcomeVideo={unitData.welcomeVideo}
						welcomeNote={unitData.welcomeNote}
						objectives={unitData.objectives}
						lessons={unitData.lessons}
						requirements={unitData.requirements}
						topics={unitData.topics}
						instructors={unitData.instructors}
					/>
				) : (
					// ❌ Fallback View (static)
					<TopicView
						name="Unit Name"
						description="Get to learn the unit using JiEdu Application."
						welcomeVideo="https://youtu.be/kvQp5r96KJc"
						welcomeNote="Welcome to this exciting unit where you'll learn lots of social and career development foundations."
						objectives={[
							"Understand programming basics",
							"Write simple programs",
							"Problem solving",
						]}
						lessons={[
							{ id: "1", number: "1.1", title: "Introduction to Python" },
							{ id: "2", number: "1.2", title: "Setting up Environment" },
							{ id: "3", number: "2.1", title: "Variables and Data Types" },
							{ id: "4",number: "2.2", title: "Control Flow" },
						]}
						requirements={["Laptop", "Internet", "Basic Math"]}
						topics={[
							{
								number: 1,
								title: "Getting Started",
								lessons: [
									{id: "1", number: "1", title: "Introduction to Python" },
									{id: "2", number: "2", title: "Setting up Environment" },
								],
							},
							{
								number: 2,
								title: "Core Concepts",
								lessons: [
									{id: "3", number: "3", title: "Variables and Data Types" },
									{id: "4", number: "4", title: "Control Flow" },
								],
							},
						]}
						instructors={[
							{
							id: 1,
							name: "Lecturer One",
							contact: "lecturer@jiedu.com",
							rating: 4,
							intro:
								"Senior lecturer with 10 years experience in teaching programming.",
							photo: "https://via.placeholder.com/100",
							},
						]}
					/>
				)}
			</div>
		</>
	);
}

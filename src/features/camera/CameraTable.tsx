import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import {  EyeIcon } from "lucide-react";
import debounce from "lodash.debounce";
import Pagination from "../../components/ui/pagination";
  
export interface Camera {
	id: number;
	name: string;
	ip_address: string;
	location: string;
	stream_url: string;
	stream_type: string;
	is_active: string;
	role: string;
	classroom: string;
	classroom_name: string;
}
  
export default function CameraTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
  	const [cameras, setCameras] = useState<Camera[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);  

	const fetchCameras = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/cameras/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCameras(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Cameras", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		
		fetchCameras(searchTerm, page);
	}, [token, searchTerm, page]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading camera...</div>;
	}

    return (
		<>
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
								Name
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
								IP Address
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
								Location
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
								Type
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
								Active
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
							{cameras.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No camera found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								cameras.map((camera) => (
									<TableRow key={camera.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{camera.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{camera.ip_address}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{camera.stream_url}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{camera.classroom_name}
													</span>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{camera.role}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{camera.stream_type}
													</span>
												</div>
											</div>
										</TableCell><TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{camera.is_active}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="Edit Group"
												className="text-green-500 hover:text-green-600 transition-colors"
												onClick={() => console.log("Edit")}
											>
												<EyeIcon size={16} />
											</button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

		</>
    );
  }
  
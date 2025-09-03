import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import {  EditIcon } from "lucide-react";
import debounce from "lodash.debounce";
import Pagination from "../../components/ui/pagination";
import { Modal } from "../../components/ui/modal";
import Swal from "sweetalert2";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import SearchableSelect from "../../components/form/DictSelect";
import { fetchDropdownData } from "../../utils/apiFetch";
  
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
  
export default function CameraTable({saveValue, searchTerm }: {saveValue:boolean,  searchTerm: string }) {
	const token = localStorage.getItem("access");
	const { isOpen, openModal, closeModal } = useModal();
  	const [cameras, setCameras] = useState<Camera[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	
    const [classrooms, setClassrooms] = useState<{ value: string; label: string; }[]>([]);

	const [saved, onSave] = useState<boolean>(false);
	const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
	const isEditing = Boolean(editingCamera);
	
	const [formData, setFormData] = useState({
        name: "",
        ip_address: "",
        stream_url: "",
        stream_type: "mjpeg",
        role: "front",
        classroom: "",
    });

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
	}, [token, searchTerm, page, saveValue, saved]);

	useEffect(() => {
		const loadDropdowns = async () => {
			setClassrooms(await fetchDropdownData("/api/classrooms/?all=true"));
		};
		loadDropdowns();
	}, []);
	console.log("Classrooms:", classrooms)
    const handleSelect = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading camera...</div>;
	}
	
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
		
        try {
            if (isEditing && editingCamera) {
				await axios.put(`/api/cameras/${editingCamera.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Camera updated successfully!", "success");
			}
            onSave(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit camera", "error");
        } finally{
			handleClose();
		}
    };

	const handleEditCamera = async (camera: Camera) => {
		setEditingCamera(camera);
		setFormData({
			name: camera.name,
			ip_address: camera.ip_address,
			stream_url: camera.stream_url,
			stream_type: camera.stream_type,
			role: camera.role,
			classroom: camera.classroom,
		});
		openModal();
	}

	const handleDeleteCamera = async (cameraId: number, cameraName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete ${cameraName} Camera? This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			handleClose();
			try {
				await axios.delete(`/api/cameras/${cameraId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${cameraName} Camera has been deleted.`, "success");
				fetchCameras(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete camera", error);
				Swal.fire("Error", "Something went wrong. Could not delete the camera.", "error");
			}
		}
	};

	const handleClose = () => {
		setEditingCamera(null);
		setFormData({ 
			name: "",
			ip_address: "",
			stream_url: "",
			stream_type: "mjpeg",
			role: "front",
			classroom: ""
		});
		closeModal();
	};


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
										<TableCell>
											<button
												title="Edit Camera "
												className="text-blue-500 hover:text-yellow-600 transition-colors  px-4"
												onClick={() => handleEditCamera(camera)}
											>
												<EditIcon size={20} />
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
									
			<Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
				<div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{isEditing ? `Edit ${editingCamera?.name}` : "Add Camera"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
					</div>

					<form className="flex flex-col"  onSubmit={handleSave}>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div>
                                <Label>Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>IP Address</Label>
                                <Input name="ip_address" value={formData.ip_address} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Stream URL</Label>
                                <Input name="stream_url" value={formData.stream_url} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Stream Type [Current: {formData.stream_type}]</Label>
                                <select
                                    name="stream_type"
                                    value={formData.stream_type}
                                    onChange={(e) => handleChangeSelect(e)}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
                                                shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                                                dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50 z-999
                                                hover:border-brand-300 hover:shadow-xl dark:hover:border-brand-500
                                                bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                                                focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                                                dark:focus:border-brand-800"
                                >
                                    <option value="mjpeg">MJPEG</option>
                                    <option value="hls">HLS</option>
                                    <option value="webrtc">WebRTC</option>
                                </select>
                            </div>
                            <div>
                                <Label>Camera Role [Current: {formData.role}]</Label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => handleChangeSelect(e)}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
                                                shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  
                                                dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/50 z-999
                                                hover:border-brand-300 hover:shadow-xl dark:hover:border-brand-500
                                                bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 
                                                focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  
                                                dark:focus:border-brand-800"
                                >
                                    <option value="front">Front</option>
                                    <option value="aux">Auxiliary</option>
                                    <option value="side">Side</option>
                                </select>
                            </div>
                            <div>
                                <Label>Classroom  [Current: {editingCamera?.classroom_name}]</Label>
                                <SearchableSelect items={classrooms} onSelect={(val) => handleSelect("classroom", val)} />
                            </div>
                        </div>

						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingCamera){
											handleDeleteCamera(editingCamera.id, editingCamera.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Camera
								</button>
							) : (
								<Button size="sm" variant="outline" onClick={closeModal}>
									Close
								</Button>
							)}
							<button
								type="submit"
								className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
							>
								Save Camera
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
    );
  }
  
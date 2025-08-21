import { SearchButton } from "../../components/dashboard/SearchButton";
import { CameraIcon } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SearchableSelect from "../../components/form/DictSelect";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { fetchDropdownData } from "../../utils/apiFetch";

export default function CameraActions({onSave, onSearch }: {onSave:(value: boolean)=>void, onSearch: (value: string) => void }) {
    const { isOpen, openModal, closeModal } = useModal();
	const token = localStorage.getItem("access");

    const [classrooms, setClassrooms] = useState<{ value: string; label: string; }[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        ip_address: "",
        stream_url: "",
        stream_type: "mjpeg",
        role: "front",
        classroom: "",
    });

    useEffect(() => {
        const loadDropdowns = async () => {
            setClassrooms(await fetchDropdownData("/api/classrooms/"));
        };
        loadDropdowns();
    }, []);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
        if (!formData.name || !formData.classroom) {
            Swal.fire("Error", "Please fill all required fields", "error");
            return;
        }

        try {
            await axios.post("/api/cameras/", 
                formData,
                {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
            );

            Swal.fire("Success", "Camera created successfully!", "success");
            setFormData({ name: "", ip_address: "", stream_url: "", stream_type: "mjpeg", role: "front", classroom: "", });
            closeModal();
            onSave(!true);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create camera", "error");
            setFormData({ name: "", ip_address: "", stream_url: "", stream_type: "mjpeg",  role: "front", classroom: "", });
            closeModal();
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:col-span-12">
                <div className="col-span-12">
                    <SearchButton onSearch={onSearch}/>
                </div>
                <div className="col-span-12">
                    
                </div>
                <div className="col-span-12">
                    <Button
                        onClick={openModal}
                        size="md"
                        variant="primary"
                        startIcon={<CameraIcon className="size-5" />}
                    >
                        Add Camera
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Camera
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
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
                                <Label>Stream Type</Label>
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
                                <Label>Camera Role</Label>
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
                                <Label>Classroom</Label>
                                <SearchableSelect items={classrooms} onSelect={(val) => handleSelect("classroom", val)} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
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
    )
}
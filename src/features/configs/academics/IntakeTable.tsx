import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";

import { Modal } from "../../../components/ui/modal";

import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import {  Pencil, Trash2, CalendarPlusIcon } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import { useModal } from "../../../hooks/useModal";

import axios from "axios";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";

interface Intake {
	id: number;
	openingMonth: string;
	closingMonth: string;
	dor: string;
}

export default function IntakeTable() {
    const { isOpen, openModal, closeModal } = useModal();
    const token = localStorage.getItem("access");

	const [intakes, setIntakes] = useState<Intake[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	const [formData, setFormData] = useState({
		openingMonth: "",
		closingMonth: ""
	});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

	useEffect(() => {
		const fetchIntakes = async () => {
			try {
				const response = await axios.get("/api/intakes/",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setIntakes(response.data.results);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch Intakes", error);
				setLoading(false);
			}
		};
		
		fetchIntakes();
			const interval = setInterval(fetchIntakes, 2000);
			return () => clearInterval(interval);
	}, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
            await axios.post("/api/intakes/", 
				formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
			);
            Swal.fire("Success", "Intake created successfully!", "success");
            setFormData({ openingMonth: "", closingMonth: ""});
            closeModal();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create intake", "error");
            setFormData({ openingMonth: "", closingMonth: ""});
            closeModal();
        }
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading intakes...</div>;
	}

	return (
		<>
			<PageMeta
				title="JiEdu Dashboard | Academic Page"
				description="Academic Page for JiEdu Application showing institution's information"
			/>

			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Intakes
						</h3>
					</div>
			
					<div className="flex items-center gap-3">
						<Button
							onClick={openModal}
							size="md"
							variant="outline"
							startIcon={<CalendarPlusIcon className="size-5" />}
						>
							Add Intakes
						</Button>
					</div>
				</div>
				
				<div className="max-w-full overflow-x-auto relative overflow-hidden">

					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Opening Month
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Closing Month
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Date Registered
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
							{intakes.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No intake found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								intakes.map((intake) => (
									<TableRow key={intake.id}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{intake.openingMonth}
												</span>
											</div>
										</div>
									</TableCell>

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{intake.closingMonth}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{intake.dor}
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
												<Pencil size={16} />
											</button>

											<button
												title="Delete Group"
												className="text-red-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => console.log("Delete")}
											>
												<Trash2 size={16} />
											</button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Intake
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">

                                <div>
                                    <Label>Opening Month</Label>
                                    <Input type="text" name="openingMonth" value={formData.openingMonth} onChange={handleChange} />  
                                </div>

								<div>
                                    <Label>Closing Month</Label>
                                    <Input type="text" name="closingMonth" value={formData.closingMonth} onChange={handleChange} />  
                                </div>

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
                                Save Intake
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
	);
}

import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { SaveIcon } from "lucide-react";

import Checkbox from "../../components/form/input/Checkbox";
// import Switch from "../../components/form/switch/Switch";
import { ToggleState, ModelPermission } from "../../types/roles";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";

interface AssignRolesTableProps {
	models: string[];
	toggleState: ToggleState;
	setToggleState: React.Dispatch<React.SetStateAction<ToggleState>>;
  }

export default function AssignRolesTable({ models, toggleState, setToggleState }: AssignRolesTableProps) {
    const token = localStorage.getItem("access");
	const navigate = useNavigate();

	console.log("Data Recieved: ", toggleState)

	const { group } = useParams<{ group: string }>();
	const { id } = useParams<{ id: string }>();
	const [permissionMap, setPermissionMap] = useState<Record<string, number>>({});

	const togglePermission = ( model: string, action: keyof ModelPermission ) => {
		model = model.toLocaleLowerCase()
		// console.log("Model: ", model, "Action: ", action)
		setToggleState((prev: ToggleState) => ({
			...prev,
			[model]: {
				...prev[model],
				[action]: !prev[model]?.[action],
			},
		}));
		// console.log(model, ":", action)
	};
	// console.log("Table Debug: ", )

	useEffect(() => {
		(async () => {
			try {
				// Fetch permission IDs and map to model+action
				const res = await axios.get("/api/permissions/",{
					headers: { 
						Authorization: `Bearer ${token}` 
					},
				});
				const data = await res.data;
				if (res.status == 200) {
					const map: Record<string, number> = {};
					// console.log("Data: ", data)
					Object.entries(data).forEach(([, models]: [string, any]) => {
						Object.entries(models).forEach(([, perms]: [string, any]) => {
							perms.forEach((perm: any) => {
								// console.log("Permission: ", perm)
								const key = perm.codename;
								map[key] = perm.id;
							});
						});
					});
					setPermissionMap(map);
					console.log("Permission map: ", map)
					
				} else {
					Swal.fire({
						toast: true,
						position: 'bottom-end', // top-right
						icon: "error",
						title: "Error",
						text: "Failed to load permissions",
						timer: 3000,
						showConfirmButton: false,
						timerProgressBar: true,
						background: '#1e293b',
						customClass: {
							popup: 'custom-toast',
							title: 'custom-toast-title',
						}
					});
				}

			} catch (err) {
				console.log(err)
				Swal.fire({
					toast: true,
					position: 'bottom-end', // top-right
					icon: "error",
					title: "Error",
					text: "Error fetching permissions",
					timer: 3000,
					showConfirmButton: false,
					timerProgressBar: true,
					background: '#1e293b',
					customClass: {
						popup: 'custom-toast',
						title: 'custom-toast-title',
					}
				});
			}
		})();
	}, []);

	const handleSaveRoles = async () => {
		if (!group) return;
		const selectedPermissionIds: number[] = [];
		console.log(toggleState)
		for (const model in toggleState) {
			for (const action of ["view", "add", "change", "delete"] as (keyof ModelPermission)[]) {
				if (toggleState[model]?.[action]) {
					const key = `${action}_${model.toLocaleLowerCase()}`;
					const id = permissionMap[key];
					console.log(key, ":", id)
					if (id) selectedPermissionIds.push(id);
				}
			}
		}

		try {
			console.log("Selected Permissions: ", selectedPermissionIds)
			const res = await fetch(`/api/groups/${group}/assign_permissions/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ group_id: id, permissions: selectedPermissionIds }),
			});
			const data = await res.json();
			if (res.ok) {
				Swal.fire({
					toast: true,
					position: 'bottom-right', // top-right
					icon: "success",
					title: "Success",
					text: "Roles saved successfully",
					timer: 3000,
					showConfirmButton: false,
					timerProgressBar: true,
					background: '#1f293b',
					customClass: {
						popup: 'custom-toast',
						title: 'custom-toast-title',
					}
				});
				navigate(-1)
			} else {
				Swal.fire({
					toast: true,
					position: 'bottom-end', // top-right
					icon: "error",
					title: "Error",
					text: data.error || "Failed to save roles",
					timer: 3000,
					showConfirmButton: false,
					timerProgressBar: true,
					background: '#1e293b',
					customClass: {
						popup: 'custom-toast',
						title: 'custom-toast-title',
					}
				});
			}
		} catch (err) {
			Swal.fire({
				toast: true,
				position: 'bottom-end', // top-right
				icon: "error",
				title: "Error",
				text: "Network error while saving roles",
				timer: 3000,
				showConfirmButton: false,
				timerProgressBar: true,
				background: '#1e293b',
				customClass: {
					popup: 'custom-toast',
					title: 'custom-toast-title',
				}
			});
		}
	};

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="max-w-full overflow-x-auto">
				<div className="col-span-3 flex justify-end px-4 py-4">
					<Button
						onClick={() => handleSaveRoles()}
						size="sm"
						variant="outline"
						startIcon={<SaveIcon className="size-5" />}
					>
						Save Roles
					</Button>
				</div>

				<Table>
					{/* Table Header */}
					<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
						<TableRow>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							UI/ Components
						</TableCell>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							View
						</TableCell>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							Create
						</TableCell>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							Update/ Edit
						</TableCell>
						<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
						>
							Delete
						</TableCell>
						</TableRow>
					</TableHeader>

					{/* Table Body */}
					<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
						{models.map((model: any, idx: number) => (
							<TableRow key={idx} >
								<TableCell className="px-5 py-4 sm:px-6 text-start">
									<div className="flex items-center gap-3">
										<div>
											<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{model}
											</span>
										</div>
									</div>
								</TableCell>
								{["view", "add", "change", "delete"].map((perm) => (
									<TableCell
										className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
										key={perm}
									>
										<div className="flex items-center gap-3">
											{/* <Switch
												label=""
												defaultChecked = {toggleState[model.toLocaleLowerCase()]?.[perm as keyof ModelPermission] || false } 
												onChange={() => togglePermission(model, perm as keyof ModelPermission)}
												color="green"
											/> */}
											{/* <input
												className=""
												type="checkbox" 
												name="" 
												id=""
												checked = {toggleState[model.toLocaleLowerCase()]?.[perm as keyof ModelPermission] || false }
												onChange={() => togglePermission(model, perm as keyof ModelPermission)}
											/> */}
											<Checkbox
												checked = {toggleState[model.toLocaleLowerCase()]?.[perm as keyof ModelPermission] || false }
												onChange={() => togglePermission(model, perm as keyof ModelPermission)}
											/>
										</div>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
  
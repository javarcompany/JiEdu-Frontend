import { LockOpenIcon } from "lucide-react";
import { Users } from "./UserListTable";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function UserInfoCard({user}: {user:Users | null}) {

    const token = localStorage.getItem("access");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleReset = async () => {
		try {
			setLoading(true);
			const res = await axios.post(`/api/reset-password/${user?.id}/`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setMessage(res.data.message);

		} catch (err: any) {
			setMessage(err.response.data.detail)
		} finally {
			setLoading(false);
		}
	};

	if (message !== ""){
		if (message.includes("success")){
			Swal.fire("Success",message, "success")
		}else{
			Swal.fire("Error", message, "error")
		}
	}

	return (
		<>
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
				<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex flex-col items-center w-full gap-6 xl:flex-row">
						<div className="w-20 h-20 overflow-hidden sm:grid-col-1 border border-gray-200 rounded-full dark:border-gray-800">
							<img src={user?.picture} alt={user?.username} />
						</div>

						<div className="order-3 xl:order-2 sm:grid-col-10">
							<h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
								{user?.userfullname}
							</h4>

							<div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{user?.username}
								</p>
								<div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{user?.branch_name}
								</p>
								<div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{user?.phone}
								</p>
								<div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{user?.email}
								</p>
							</div>
						</div>

						<div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
							<button
								onClick={handleReset}
								disabled={loading}
								className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-blue-700 px-2 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
							>
								<LockOpenIcon className="size-5" />
								{loading ? "Resetting..." : "Reset Password"}
							</button>
						</div>
					</div>
				</div>
			</div>

		</>
	);
}

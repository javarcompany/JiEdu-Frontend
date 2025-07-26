import { UsersIcon } from "lucide-react";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";

export default function Actions() {
	const navigate = useNavigate();

	return (
		<div className="mx-auto mb-1 w-full rounded-2xl bg-blue-800 px-4 py-4 text-center dark:bg-white/[0.03]">
			<h3 className="mb-2 font-semibold text-white">
				JiEdu Attendance
			</h3>

			<p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
				
			</p>

            <Button
				onClick={() => navigate("/attendance-report")}
                startIcon = {<UsersIcon/>}            
                className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-yellow-500 dark:bg-blue-800 text-theme-sm hover:bg-gray-400"
            >
                View Attendance
            </Button>
            
		</div>
	);
}

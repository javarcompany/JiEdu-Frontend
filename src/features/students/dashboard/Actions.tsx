import { FileSpreadsheetIcon } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";

export default function Actions() {
	const navigate = useNavigate();

	return (
		<div className="mx-auto mb-1 w-full rounded-2xl bg-blue-800 px-4 py-4 text-center dark:bg-white/[0.03]">
			<h3 className="font-semibold text-white">
				JiEdu Students
			</h3>
			
            <Button
				onClick={() => navigate("/student-report")}
                startIcon = {<FileSpreadsheetIcon />}            
                className="flex items-center justify-center font-medium text-white rounded-lg bg-yellow-500 dark:bg-blue-800 text-theme-sm hover:bg-gray-400"
            >
                Student Report
            </Button>
            
		</div>
	);
}

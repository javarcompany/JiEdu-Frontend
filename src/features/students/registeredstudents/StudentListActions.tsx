import Button from "../../../components/ui/button/Button"
import { BoxCubeIcon, UserIcon } from "../../../icons"
import { useNavigate } from "react-router"
import { SearchButton } from "../../../components/dashboard/SearchButton";
import Swal from "sweetalert2";
import axios from "axios";
import { UploadCloudIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function StudentActions(
        { onSearch, 
            promotionMode, 
            selectedStudentIds, 
            setSelectedStudentIds, 
            setReloadFlag }: 
        
        { onSearch: (value: string) => void, 
            promotionMode: boolean, 
            selectedStudentIds: number[], 
            setSelectedStudentIds: (ids: number[]) => void, 
            setReloadFlag: (flag: any) => void }) {

    const navigate = useNavigate();
	const token = localStorage.getItem("access");
        
	const handleBatchPromotion = async () => {
		if (selectedStudentIds.length === 0) return;

		try {
			Swal.fire({
				title: "Promoting Students...",
				text: "Please wait...",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});

			const res = await axios.post(
				`/api/promote/promote-batch/`,
				{ student_ids: selectedStudentIds },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const responseData = res.data;
            setReloadFlag((prev: number) => prev + 1);
			responseData.forEach((msg: any, index: number) => {
                setTimeout(() => {
                    if (msg.message) {
                        toast.success(msg.message, { autoClose: 2000 });
                    } else if (msg.error) {
                        toast.error(msg.error, { autoClose: 2000 });
                    }
                }, index * 2100); // stagger each toast by 2.1 seconds
            });

		} catch (err: any) {
			Swal.close();
			Swal.fire("Error", err.message || "Promotion failed", "error");
		} finally {
			setSelectedStudentIds([]);
            Swal.close();
        }
	};

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div>
                <Button
                    onClick={() => navigate("/new-student")}
                    size="sm"
                    variant="outline"
                    startIcon={<UserIcon className="size-5" />}
                >
                    Register New Student
                </Button>
            </div>
            <div>
                <Button
                    size="sm"
                    variant="primary"
                    startIcon={<BoxCubeIcon className="size-5" />}
                    className=""
                >
                    Export Student List
                </Button>
            </div>
            {promotionMode && (
                <div>
                    <Button
                        variant="primary"
                        onClick={handleBatchPromotion}
                        startIcon={<UploadCloudIcon className="size-5" />}
                        className="bg-green-600 hover:bg-green-500"
                    >
                        Promote Selected Students
                    </Button>
                </div>
            )}
            <div>
                <SearchButton onSearch={onSearch} />
            </div>
        </div>
    )
};
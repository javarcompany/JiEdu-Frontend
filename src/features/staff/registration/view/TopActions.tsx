import axios from "axios";
import Button from "../../../../components/ui/button/Button";
import { TrashIcon, LockOpenIcon, SmilePlus } from "lucide-react";
import { PenIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Staff } from "./MainBody";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffTopActions() {
    
    const { id } = useParams<{ id: string }>();
    
    const token = localStorage.getItem("access");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
    
    const [staff, setStaff] = useState<Staff | null>(null);
	const navigate = useNavigate();

    useEffect(() => {
		const fetchStaff = async () => {
			try {
				const response = await axios.get(`/api/staffs/${id}`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
						params: {user_type: "Staff"},
                    }
				);
				setStaff(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch Staff form", error);
				setLoading(false);
                navigate(-1);
			}
		};
		
		fetchStaff();
	},[]);

	const handleReset = async () => {
		try {
			setLoading(true);
			const res = await axios.post(`/api/reset-password/${staff?.id}/`,
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

	useEffect(() => {
		if (message !== ""){
			if (message.includes("success")){
				Swal.fire("Success",message, "success")
			}else{
				Swal.fire("Error", message, "error")
			}
		}
		setMessage("");
	},[message]);

	const handleEnrollFace = () => {
		if (staff?.regno) {
			navigate(`/enroll-face/${encodeURIComponent(staff.regno)}/staff`);
		} else {
			Swal.fire("Missing RegNo", "The staff registration number is not available", "error");
		}
	};

    return (
        <div className="flex flex-wrap justify-between gap-3 w-full">

            <Button
                size="sm"
                variant="primary"
                onClick={handleReset}
                disabled={loading}
                startIcon={<LockOpenIcon className="size-5" />}
                className="bg-red-800  flex-1 min-w-[40px] sm:min-w-[120px]"
            >
                <span className="hidden sm:inline">{loading ? "Resetting..." : "Reset Password"}</span>
            </Button>
            
            <Button
				size="sm"
				variant="primary"
				startIcon={<PenIcon className="size-5" />}
				className="flex-1 min-w-[40px] sm:min-w-[120px]"
			>
				<span className="hidden sm:inline">Edit Bio Data</span>
			</Button>
            
            <Button
                size="sm"
                variant="primary"
                startIcon={<TrashIcon className="size-5" />}
                className="bg-yellow-500 hover:bg-red-800 flex-1 min-w-[40px] sm:min-w-[120px]"
            >
                <span className="hidden sm:inline">Delete Staff</span>
            </Button>

			<Button
				size="sm"
				variant="primary"
				onClick={handleEnrollFace}
				startIcon={<SmilePlus className="size-5" />}
				className="bg-purple-800 hover:bg-purple-700 flex-1 min-w-[40px] sm:min-w-[120px]"
			>
				<span className="hidden sm:inline">Enroll Face</span>
			</Button>

        </div>
    )
};
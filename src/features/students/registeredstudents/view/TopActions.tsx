import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/ui/button/Button";
import {
	LockOpenIcon,
	UploadCloudIcon,
	PenIcon,
	SmilePlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Student } from "../StudentTable";
import axios from "axios";
import Swal from "sweetalert2";

export default function StudentTopActions() {

    const { id } = useParams<{ id: string }>();
    
    const token = localStorage.getItem("access");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
    
    const [student, setStudent] = useState<Student | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const response = await axios.get(`/api/students/${id}`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
				setStudent(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch student form", error);
				setLoading(false);
                navigate(-1);
			}
		};
		
		fetchStudent();
	},[]);

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

	const handleReset = async () => {
		try {
			setLoading(true);
			const res = await axios.post(`/api/reset-password/${student?.email}/`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
					params: {user_type: "Student"},
				}
			);
			setMessage(res.data.message);

		} catch (err: any) {
			setMessage(err.response.data.detail)
		} finally {
			setLoading(false);
		}
	};

	const handlePromotion = async () => {
		try {
			Swal.fire({
				title: "Promoting Student...",
				text: "Please wait while promoting the student...",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});

			const res = await axios.post(
				`/api/promote/promote-batch/`,
				{ student_ids: [student?.id] },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const responseData = res.data;

			let feedbackMessage = "Student promoted successfully";
			if (Array.isArray(responseData) && responseData.length > 0) {
				if (responseData[0].message) {
					feedbackMessage = responseData[0].message;
				} else if (responseData[0].error) {
					throw new Error(responseData[0].error);
				}
			}

			Swal.close();
			Swal.fire("Success", feedbackMessage, "success");
			navigate("/");
		} catch (err: any) {
			let errorMessage = "Something went wrong";
			if (err.response?.data?.detail) {
				errorMessage = err.response.data.detail;
			} else if (err.message) {
				errorMessage = err.message;
			}
			Swal.close();
			Swal.fire("Error", errorMessage, "error");
		} finally {
			setLoading(false);
		}
	};

	const handleEnrollFace = () => {
		if (student?.regno) {
			navigate(`/enroll-face/${encodeURIComponent(student.regno)}/student`);
		} else {
			Swal.fire("Missing RegNo", "The student registration number is not available", "error");
		}
	};
	
	return (
		<div className="flex flex-wrap justify-between gap-3 w-full">

			{student?.state !== "Active" && (
				<Button
					size="sm"
					variant="primary"
					onClick={handlePromotion}
					startIcon={<UploadCloudIcon className="size-5" />}
					className="bg-success-800 hover:bg-yellow-600 flex-1 min-w-[40px] sm:min-w-[120px]">
					<span className="hidden sm:inline">Promote</span>
				</Button>
			)}

			<Button
				size="sm"
				variant="primary"
                onClick={handleReset}
                disabled={loading}
				startIcon={<LockOpenIcon className="size-5" />}
				className="bg-red-800 flex-1 min-w-[40px] sm:min-w-[120px]"
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
				onClick={handleEnrollFace}
				startIcon={<SmilePlus className="size-5" />}
				className="bg-purple-800 hover:bg-purple-700 flex-1 min-w-[40px] sm:min-w-[120px]"
			>
				<span className="hidden sm:inline">Enroll Face</span>
			</Button>
		</div>
	);
}

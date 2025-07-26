import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/ui/button/Button";
import { FileXIcon, BadgeCheckIcon, TrashIcon } from "lucide-react";
import { PenIcon } from "lucide-react";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function ApplicationTopActions() {
    
    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem("access");
    const navigate = useNavigate();
    const [status, setStatus] = useState<"pending" | "approved" | "declined" | "joined">("pending");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`/api/check-application-status/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params:{application_id: id}
                });
                setStatus(response.data.status); // ensure API returns 'status': 'approved' | 'declined' | 'joined'
            } catch (error) {
                console.error("Failed to fetch application status", error);
            }
        };
        fetchStatus();
    }, [id, token]);
    
    const handleApproval = async () => {
        
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we submit the application.",
            allowOutsideClick: false,
            didOpen: () => {
            Swal.showLoading();
            },
        });

        try {
            const response = await axios.post(`/api/approve-application/${id}/`,
                {}, // empty data/body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.close()
            if (response.status == 200){
                Swal.fire("Success", response.data.message, "success");
                console.log(response.data.message)
                navigate("/")
            }
            
        } catch (error) {
            console.error("Failed to fetch Applicants", error);
        }
    }

    const handleDecline = async () => {
        
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we submit the application.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await axios.post(`/api/decline-application/${id}/`,
                {}, // empty data/body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.close()
            if (response.status == 200){
                Swal.fire("Success", response.data.message, "success");
                console.log(response.data.message)
                navigate("/")
            }
            
        } catch (error) {
            console.error("Failed to fetch Applicants", error);
        }
    }

    return (
        <div className="flex flex-wrap justify-between gap-3 w-full">
                
            {status !== "approved" && status !== "joined" && (
                <Button
                    onClick={handleApproval}
                    size="sm"
                    variant="primary"
                    className="bg-green-800"
                    startIcon={<BadgeCheckIcon className="size-5" />}
                >
                    Approve
                </Button>
            )}
            
            {status !== "declined" && status !== "joined" && (
                <Button
                    onClick={handleDecline}
                    size="sm"
                    variant="primary"
                    className="bg-red-800"
                    startIcon={<FileXIcon className="size-5" />}
                >
                    Decline
                </Button>
            )}
            
            {status !== "approved" && status !== "joined" && (
                <Button
                    size="sm"
                    variant="primary"
                    startIcon={<PenIcon className="size-5" />}
                >
                    Edit
                </Button>
            )}
            
            {status !== "approved" && status !== "joined" && (
                <Button
                    size="sm"
                    variant="primary"
                    startIcon={<TrashIcon className="size-5" />}
                    className="bg-yellow-600 hover:bg-red-800"
                >
                    Delete
                </Button>
            )}
                
        </div>
    )
};
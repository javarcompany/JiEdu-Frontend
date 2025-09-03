import LeftComponents from "./LeftComponents";
import RightComponents from "./RightComponents";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useUser } from "../../../context/AuthContext";
import Alert from "../../../components/ui/alert/Alert";

export default function StudentHome() {
    const {user} = useUser();
    const token = localStorage.getItem("access")
    const [promotionState, setPromotionState] = useState<boolean>();
    
    const showToast = (icon: "success" | "error" | "info", message: string) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon,
            title: message,
        });
    };

    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await axios.get(`/api/search-student-state/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { student_regno: user?.regno }
                    }
                );
                setPromotionState(response.data);
            } catch (error) {
                console.error("Failed to fetch Student State", error);
            }
        };
        fetchState();
    }, [token]);


    const handlePromote = async () => {
        try {
            const response = await axios.get(`/api/promote/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { student_regno: user?.regno }
                }
            );
            setPromotionState(response.data.state);
            showToast(response.data.kind, response.data.message)
        } catch (error) {
            console.error("Failed to fetch Student State", error);
        }
    }
    
    return (
        <>
            <PageMeta
                title="JiEdu Students | Home Page"
                description="Home Page for JiEdu Application showing student's summary"
            />

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 xl:col-span-9">
                    {promotionState &&(
                        <div className="col-span-12">
                            <Alert
                                variant="error"
                                title="Accept Promotion"
                                message="You can only access this terms operations once you accept this promotion."
                                showLink={false}
                                linkHref=""
                                linkText="Click Here for Promotion"
                                actions={[
                                    { label: "Promote", onClick: handlePromote, variant: "danger" }
                                ]}
                            />
                        </div>
                    )}
                    <LeftComponents />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <RightComponents />
                </div>

                <div className="col-span-12">
                    {/* <BottomComponents /> */}
                </div>
            </div>           

        </>
    );
}
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Camera, UploadCloud, SmilePlus } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

export default function FaceEnroll() {
    const { regno, type } = useParams<{ regno: string; type: string }>();
    const [capturing, setCapturing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const token = localStorage.getItem("access");
 
    const startCamera = async () => {
        setCapturing(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Camera access denied", err);
            Swal.fire("Error", "Camera access denied", "error");
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const context = canvasRef.current.getContext("2d");
        if (!context) return;

        context.drawImage(videoRef.current, 0, 0, 300, 300);
        const dataUrl = canvasRef.current.toDataURL("image/jpeg");
        setPreview(dataUrl);
        setCapturing(false);

        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
    };

    const uploadImage = async (imageBlob: Blob) => {
        if (!regno || !type) {
            Swal.fire("Missing Info", "Registration number or type is missing from URL.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("regno", regno);
        formData.append("type", type);

        try {
            const response = await axios.post("/api/enroll-face/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire("Success", response.data.message, "success");
        } catch (err: any) {
            Swal.fire("Enrollment Failed", err.response?.data?.error || err.message, "error");
        }
    };

    const handleEnroll = async () => {
        if (!preview) return;
        const blob = await fetch(preview).then((res) => res.blob());
        uploadImage(blob);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setPreview(URL.createObjectURL(file));
        uploadImage(file);
    };

    return (
        <>
            <PageMeta
                title="JiEdu Biometrics | Enroll Face Page"
                description="Biometrics Page for JiEdu Application showing biometrics of the institution"
            />
            <div className="space-y-6 max-w-lg mx-auto p-6 rounded-xl border bg-white shadow dark:bg-gray-900 dark:border-gray-700">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <SmilePlus className="text-blue-600" /> Face Enrollment
                </h2>

                {preview ? (
                    <img
                        src={preview}
                        alt="Captured"
                        className="w-72 h-72 object-cover rounded-lg border shadow mx-auto"
                    />
                ) : capturing ? (
                    <div className="flex flex-col items-center">
                        <video ref={videoRef} width="300" height="300" className="rounded shadow border" />
                        <button
                            onClick={captureImage}
                            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
                        >
                            <Camera size={18} /> Capture Face
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <button
                            onClick={startCamera}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            <Camera size={18} /> Use Webcam
                        </button>

                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded cursor-pointer">
                            <UploadCloud size={18} />
                            Upload Image
                            <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                        </label>
                    </div>
                )}

                {preview && (
                    <div className="text-center">
                        <button
                            onClick={handleEnroll}
                            className="mt-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                        >
                            Enroll Face
                        </button>
                    </div>
                )}

                <canvas ref={canvasRef} width="300" height="300" className="hidden" />

            </div>
        </>
    );
}

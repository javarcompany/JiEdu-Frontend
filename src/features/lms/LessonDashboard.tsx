import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DocumentEditor from "../../components/lms/CreateContent";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { FileText, Video, Image as ImageIcon, Music, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useUser } from "../../context/AuthContext";

// Interfaces
interface CourseContent {
  id: number;
  content_type: "pdf" | "text" | "audio" | "video" | "image";
  title: string;
  text?: string;        // stored as raw stringified JSON
  pdf_file?: string;
  external_url?: string;
  caption?: string;
}

export default function LessonContents() {
  const { user } = useUser();
  const token = localStorage.getItem("access");
  const { lessonid } = useParams<{ lessonid: string }>();
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [activeContent, setActiveContent] = useState<CourseContent | null>(null);
  const [modalContent, setModalContent] = useState<CourseContent | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create content state
  const [newType, setNewType] = useState<"pdf" | "text" | "audio" | "video" | "image">("text");
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newText, setNewText] = useState<string>("");

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get(`/api/lesson/contents/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { lesson_id: lessonid },
        });

        setContents(res.data);

        if (res.data.length > 0 && res.data[0].content_type === "text") {
          setActiveContent(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch lesson contents", err);
      }
    };

    if (lessonid) fetchContents();
  }, [lessonid, token]);

  const handleContentClick = (c: CourseContent) => {
    if (c.content_type === "pdf" && c.pdf_file) {
      window.open(`/${c.pdf_file}`, "_blank");
    } else if (["video", "audio", "image"].includes(c.content_type)) {
      setModalContent(c);
      openModal();
    } else if (c.content_type === "text") {
      setActiveContent(c);
    }
  };

  const handleClose = () => {
    closeModal();
    setModalContent(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text": return <FileText size={16} />;
      case "video": return <Video size={16} />;
      case "image": return <ImageIcon size={16} />;
      case "audio": return <Music size={16} />;
      case "pdf": return <FileText size={16} className="text-red-600" />;
      default: return null;
    }
  };

  // Save new content
  const handleSaveContent = async () => {
    const formData = new FormData();
    formData.append("lesson", lessonid || "");
    formData.append("title", newTitle);
    formData.append("content_type", newType);

    if (newType === "pdf" || newType === "audio" || newType === "image") {
      if (newFile) formData.append("file", newFile);
    }
    if (newType === "video") {
      if (!/^https?:\/\/.+/.test(newUrl)) {
        alert("Invalid video URL");
        return;
      }
      formData.append("external_url", newUrl);
    }
    if (newType === "text") {
      formData.append("text", newText);
    }

    try {
      await axios.post(`/api/lesson/contents/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsCreateOpen(false);
      setNewTitle("");
      setNewFile(null);
      setNewUrl("");
      setNewText("");
      // reload list
      const res = await axios.get(`/api/lesson/contents/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { lesson_id: lessonid },
      });
      setContents(res.data);
    } catch (err) {
      console.error("Error saving content", err);
    }
  };

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            {/* Main Viewer */}
            <div className="col-span-9 p-4 rounded-xl bg-white dark:bg-gray-900 shadow">
            {activeContent && activeContent.content_type === "text" ? (
                <>
                <h2 className="text-xl font-bold mb-4">{activeContent.title}</h2>
                <DocumentEditor
                    content={activeContent.text || ""}
                    readOnly={true}
                    onChange={undefined}
                />
                </>
            ) : (
                <p className="text-gray-400 italic">Select a text content to view here</p>
            )}
            </div>

            {/* Sidebar */}
            <div className="col-span-3 sticky p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md h-[80vh] overflow-y-auto">
            <div className="flex flex-col items-left mb-4 mt-4 gap-4">
              {user?.user_type !== "student" && (
                <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 text-white hover:bg-red-600"
                >
                <Plus size={18} /> Create
                </Button>
              )}
                <h2 className="text-lg font-bold">Related Contents</h2>
            </div>
            <ul className="space-y-2">
                {contents.map((c) => (
                <li
                    key={c.id}
                    className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition-all 
                    ${activeContent?.id === c.id ? "font-bold text-blue-600" : "hover:text-blue-500 hover:translate-x-1"}`}
                    onClick={() => handleContentClick(c)}
                >
                    {getIcon(c.content_type)}
                    {c.title}
                </li>
                ))}
            </ul>
            </div>

            {/* Floating Modal for media preview */}
            {modalContent && (
            <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4 max-h-[90vh] items-start">
                <div className="relative w-full h-full overflow-y-auto bg-white rounded-3xl p-4 dark:bg-gray-900 lg:p-11 border-t-2 border-blue-600 custom-scrollbar">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{modalContent.title}</h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">{modalContent.caption}</p>
                </div>
                <div className="px-2">
                    {modalContent.content_type === "video" && modalContent.external_url && (
                    <iframe src={modalContent.external_url} className="w-full h-[400px] rounded-md" allow="autoplay; encrypted-media" allowFullScreen />
                    )}
                    {modalContent.content_type === "image" && modalContent.external_url && (
                    <img src={modalContent.external_url} alt={modalContent.caption} className="w-full rounded-md" />
                    )}
                    {modalContent.content_type === "audio" && modalContent.external_url && (
                    <audio controls src={modalContent.external_url} className="w-full" />
                    )}
                </div>
                </div>
            </Modal>
            )}

            {/* Create Content Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="max-w-[800px] m-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-bold mb-4">Create New Content</h2>

                {/* Content type selector */}
                <div className="flex gap-3 mb-4">
                {["pdf", "text", "audio", "video", "image"].map((t) => (
                    <button
                    key={t}
                    onClick={() => setNewType(t as any)}
                    className={`px-3 py-1 rounded-md border ${newType === t ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                    {t.toUpperCase()}
                    </button>
                ))}
                </div>

                <input
                type="text"
                placeholder="Enter Title"
                className="w-full p-2 border rounded-md"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                />

                {/* Type-specific input */}
                {newType === "pdf" && (
                <input type="file" accept="application/pdf" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                )}
                {newType === "audio" && (
                <input type="file" accept="audio/*" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                )}
                {newType === "image" && (
                <input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                )}
                {newType === "video" && (
                <input
                    type="url"
                    placeholder="Enter video URL"
                    className="w-full p-2 border rounded-md"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                />
                )}
                {newType === "text" && (
                <DocumentEditor content={newText} onChange={setNewText} />
                )}

                <button onClick={handleSaveContent} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Save
                </button>
            </div>
            </Modal>
        </div>
    );
}

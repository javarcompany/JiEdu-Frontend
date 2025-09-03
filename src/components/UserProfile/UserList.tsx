import { useState } from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import { User } from "./StudentProfileDashboard";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useUser } from "../../context/AuthContext";

export default function UserStack({ users }: { users: User[] }) {
  const { closeModal } = useModal();
  const { user } = useUser();
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    placement: "top" | "bottom";
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleClose = () => {
    closeModal();
    setSelectedUser(null);
  };

  const handleMouseEnter = (u: User, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Decide placement
    const placement = rect.top < viewportHeight / 1.2 ? "bottom" : "top";

    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
      placement,
    });
    setHoveredUser(u);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
        {user?.user_type === "student" ? "Classmates" : "Staffmates"}
      </h2>

      <div className="overflow-x-auto p-4">
        <div className="flex items-center -space-x-3 relative">
          {users.map((u) => (
            <motion.img
              key={u.id}
              src={u.passport}
              alt={u.regno}
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer shadow-sm"
              onMouseEnter={(e) => handleMouseEnter(u, e)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => setSelectedUser(u)}
              whileHover={{ scale: 1.2, zIndex: 50 }}
            />
          ))}
        </div>
      </div>

      {/* Tooltip rendered in portal */}
      {hoveredUser && tooltipPos &&
        ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0, y: tooltipPos.placement === "top" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: tooltipPos.placement === "top" ? 10 : -10 }}
            className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 text-xs w-48 z-[9999] text-center"
            style={{
              top:
                tooltipPos.placement === "top"
                  ? tooltipPos.y - 80
                  : tooltipPos.y + 50,
              left: tooltipPos.x - 80,
              transform:
                tooltipPos.placement === "top"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0)",
            }}
          >
            <p className="font-semibold">{hoveredUser.name}</p>
            <p className="text-gray-500">@{hoveredUser.regno}</p>
            <p className="text-gray-600">{hoveredUser.branch} Campus</p>
          </motion.div>,
          document.body
        )}

      {/* Modal */}
      <Modal isOpen={!!selectedUser} onClose={handleClose} className="max-w-[300px] m-4 p-4">
        {selectedUser && (
          <>
            <img
              src={selectedUser.passport}
              alt={selectedUser.name}
              className="w-24 h-24 rounded-lg mx-auto mb-4 object-cover"
            />
            <h2 className="text-lg font-bold text-center">{selectedUser.name}</h2>
            <p className="text-center text-gray-500">@{selectedUser.regno}</p>
            <hr className="my-3" />
            <div className="space-y-2 text-sm">
              <p><strong>DOB:</strong> {selectedUser.dob}</p>
              <p><strong>Branch:</strong> {selectedUser.branch}</p>
              {user?.user_type === "student" && (
                <p><strong> Location :</strong> {selectedUser.location}</p>
              )}
              {user?.user_type === "staff" && (
                <p><strong> Designition :</strong> {selectedUser.location}</p>
              )}
            </div>
            <hr className="my-3" />
            <div className="flex justify-around mt-4">
              <button
                onClick={() => (window.location.href = `tel:${selectedUser.phone}`)}
                className="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600"
              >
                Call
              </button>
              <button
                onClick={() => (window.location.href = `mailto:${selectedUser.email}`)}
                className="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600"
              >
                Email
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

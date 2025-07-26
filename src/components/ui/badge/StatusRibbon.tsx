import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCheckIcon,
} from "lucide-react";

interface StatusRibbonProps {
  state: "Joined" | "Approved" | "Pending" | "Declined";
}

export default function StatusRibbon({ state }: StatusRibbonProps) {
  const config = {
    Joined: {
      color: "bg-green-600",
      icon: <UserCheckIcon className="w-5 h-5" />,
      label: "Joined",
    },
    Approved: {
      color: "bg-blue-600",
      icon: <CheckCircleIcon className="w-5 h-5" />,
      label: "Approved",
    },
    Pending: {
      color: "bg-yellow-400 text-gray-900",
      icon: <ClockIcon className="w-5 h-5" />,
      label: "Pending",
    },
    Declined: {
      color: "bg-red-600",
      icon: <XCircleIcon className="w-5 h-5" />,
      label: "Declined",
    },
  }[state];

  return (
    <div className="absolute top-2 right-0 group">
      <div
        className={`
          flex items-center gap-2 pr-4 pl-6 py-2 text-white shadow-md transition-all duration-300 cursor-default
          relative overflow-hidden group-hover:pl-8
          ${config.color}
        `}
        style={{
          clipPath: "polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 25px 50%)",
        }}
      >
        {config.icon}
        <span className="hidden group-hover:inline text-sm font-semibold">
          {config.label}
        </span>
      </div>
    </div>
  );
}

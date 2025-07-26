// import { useNavigate } from "react-router";
// import { SaveIcon } from "lucide-react";
// import Button from "../../components/ui/button/Button";


interface AssignActionTabProps {
    apps: {
      id: number;
      app_label: string;
      verbose_name: string;
      group_name: string;
      models: string[];
    }[];
    selectedApp: string | null;
    onAppChange: (appLabel: string) => void;
}

export default function AssignActionTab({ apps, selectedApp, onAppChange }: AssignActionTabProps) {
    // const navigate = useNavigate();
    

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* App Selection */}
            <div className="col-span-3">
                <select
                    className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    value={selectedApp || ""}
                    onChange={(e) => onAppChange(e.target.value)}
                >
                    <option value="">Select App</option>
                    {apps.map((app) => (
                        <option key={app.app_label} value={app.app_label}>
                            {app.verbose_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reserved for additional filters */}
            <div className="col-span-6">
            {/* Additional UI components like group or model filtering can go here */}
            </div>

            {/* Save Button */}
            <div className="col-span-3 flex justify-end">
                
            </div>
        </div>
    );
}

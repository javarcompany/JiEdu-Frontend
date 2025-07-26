import PageMeta from "../../components/common/PageMeta";
import AssignActionTab from "./AssignActionTab";
import AssignRolesTable from "./AssignActionTable";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToggleState } from "../../types/roles";

import { useParams } from "react-router-dom";

interface AppData {
    id: number;
    app_label: string;
    verbose_name: string;
    group_name: string;
    models: string[];
}

export default function AssignRoles() {

    const token = localStorage.getItem("access");

    const { group } = useParams<{ group: string }>();

    const [apps, setApps] = useState<AppData[]>([]);
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggleState, setToggleState] = useState<ToggleState>({});

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("/api/app-models/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApps(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [token]);

    const handleAppChange = async (appLabel: string) => {
        const selected = apps.find(app => app.app_label === appLabel);
        setSelectedApp(appLabel);
    
        const modelList = selected?.models || [];
        setModels(modelList);

        if (appLabel != ""){
    
            try {
                // selected?.group_name
                const response = await axios.get(`/api/role-permissions/?app=${appLabel}&group=${group}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                const dbToggleState = response.data;
                // console.log("DB States:",  dbToggleState)
        
                // Fill missing models with default permissions (in case of partial DB results)
                const initialToggleState: ToggleState = {};

                // console.log("Initial States:",  initialToggleState)
                
                modelList.forEach((model) => {
                    model = model.toLocaleLowerCase()
                    initialToggleState[model] = dbToggleState[model] || {
                        view: false,
                        add: false,
                        change: false,
                        delete: false
                    };
                });
        
                setToggleState(initialToggleState);

                console.log(initialToggleState)
        
            } catch (error) {
                console.error("Failed to fetch role permissions:", error);
            }
        }
    };
    
    if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading roles...</div>;
	}

    return (
        <>
            <PageMeta
                title="JiEdu Roles | Role Assignment Page"
                description="Role Assigning Page for JiEdu Application"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <AssignActionTab apps={apps} selectedApp={selectedApp} onAppChange={handleAppChange}/>
                    <AssignRolesTable  models={models} toggleState={toggleState} setToggleState={setToggleState}/>
                </div>
            </div> 
        </>
    );
}
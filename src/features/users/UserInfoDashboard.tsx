import PageMeta from "../../components/common/PageMeta";
import UserInfoCard from "./UserProfile";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Users } from "./UserListTable";
import axios from "axios";

export default function UserInfoDashboard() {
	
    const token = localStorage.getItem("access");
    const [user, setUser] = useState<Users | null>(null);
	
    const { userid } = useParams<{ userid: string }>();

	useEffect(() => {
		
		const fetchUser = async () => {
			try {
				const response = await axios.get(`/api/users/${userid}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setUser(response.data);
			} catch (error) {
				console.error("Failed to fetch users:", error);
			}
		};
		fetchUser();
	}, []);
	
	return (
		<>
			<PageMeta
				title="JiEdu Dashboard | Admin Page"
				description="Users Page for JiEdu Application making the system's configurations"
			/>

				<div className="grid grid-cols-12 gap-2">
					<div className="col-span-12 xl:col-span-8">
						<UserInfoCard user={user}/>
                	</div>

					<div className="col-span-12 xl:col-span-4">
						
					</div>
				</div>
		</>
	)
}
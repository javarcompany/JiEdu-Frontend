import PageMeta from "../../components/common/PageMeta";
import UserListTable from "./UserListTable";
import UserActions from "./UserListAction";
import { useState } from "react";
 
export default function UserList() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <>
            <PageMeta
                title="JiEdu Users | User List Page"
                description="Users Page for JiEdu Application showing list of users in the system"
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <UserActions onSearch={setSearchTerm} />
                    <UserListTable searchTerm={searchTerm} />
                </div>
            </div> 
        </>
    );
}
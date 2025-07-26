import Button from "../../components/ui/button/Button";
import { UserIcon } from "../../icons";
import { UploadCloudIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { SearchButton } from "../../components/dashboard/SearchButton";

export default function UserActions({ onSearch }: { onSearch: (value: string) => void }) {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-3">
                <SearchButton onSearch={onSearch}/>
            </div>
            <div className="col-span-3">
                <Button
                    size="sm"
                    variant="primary"
                    startIcon={<UploadCloudIcon className="size-5" />}
                    className=""
                >
                    Export User List
                </Button>
            </div>
            <div className="col-span-3">

            </div>
            <div className="col-span-3">
                <Button
                    onClick={() => navigate("")}
                    size="sm"
                    variant="outline"
                    startIcon={<UserIcon className="size-5" />}
                >
                    Register User
                </Button>
            </div>
        </div>
    )
};
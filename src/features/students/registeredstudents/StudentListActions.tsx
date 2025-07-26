import Button from "../../../components/ui/button/Button"
import { BoxCubeIcon, UserIcon } from "../../../icons"
import { useNavigate } from "react-router"
import { SearchButton } from "../../../components/dashboard/SearchButton";

export default function StudentActions({ onSearch }: { onSearch: (value: string) => void }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div>
                <Button
                    onClick={() => navigate("/new-student")}
                    size="sm"
                    variant="outline"
                    startIcon={<UserIcon className="size-5" />}
                >
                    Register New Student
                </Button>
            </div>
            <div>
                <Button
                    size="sm"
                    variant="primary"
                    startIcon={<BoxCubeIcon className="size-5" />}
                    className=""
                >
                    Export Student List
                </Button>
            </div>
            <div>
            </div>
            <div>
                <SearchButton onSearch={onSearch} />
            </div>
        </div>
    )
};
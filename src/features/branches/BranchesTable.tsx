import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {  Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

interface Branch {
	id: number;
	name: string;
	code: string;
	paddr: string;
	tel_a: string;
	tel_b: string;
	email: string;
}
  
export default function BranchesTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [branches, setBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchBranches = async () => {
			try {
				const response = await axios.get("/api/branches/",
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
				setBranches(response.data.results);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch branches", error);
				setLoading(false);
			}
		};
		
		fetchBranches();
			const interval = setInterval(fetchBranches, 2000);
			return () => clearInterval(interval);
	}, []);

    const filteredData = branches.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action(s)
                </TableCell>
              </TableRow>
            </TableHeader>
  
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
				{filteredData.map((branch) => (
					<TableRow key={branch.id}>
						<TableCell className="px-5 py-4 sm:px-6 text-start">
							<div className="flex items-center gap-3">
								<div>
									<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
										{branch.name}
									</span>
									<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
										{branch.code}
									</span>
								</div>
							</div>
						</TableCell>
						<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
							<div className="flex items-center gap-3">
								<div>
									<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
										{branch.paddr}
									</span>
								</div>
							</div>
						</TableCell>
						<TableCell className="px-5 py-4 sm:px-6 text-start">
							<div className="flex items-center gap-3">
								<div>
									<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
										{branch.tel_a}
									</span>
									<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
										{branch.tel_b}
									</span>
								</div>
							</div>
						</TableCell>
						<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
							<div className="flex items-center gap-3">
								<div>
									<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
										{branch.email}
									</span>
								</div>
							</div>
						</TableCell>
						<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
							<button
								title="Edit Group"
								className="text-green-500 hover:text-green-600 transition-colors"
								onClick={() => console.log("Edit")}
							>
								<Pencil size={16} />
							</button>

							<button
								title="Delete Group"
								className="text-red-500 hover:text-red-600 transition-colors  px-4"
								onClick={() => console.log("Delete")}
							>
								<Trash2 size={16} />
							</button>
						</TableCell>
					</TableRow>
				))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
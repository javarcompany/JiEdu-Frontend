import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";

import { Units } from "../../../units/UnitsTable";
import Swal from "sweetalert2";

export default function StudentRightActions() {

    const token = localStorage.getItem("access");
    const [units, setUnits] = useState<Units[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
		const fetchUnits = async () => {
			try {
				const response = await axios.get(`/api/student/units/${id}/`,
					{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
				);
				setUnits(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch students units", error);
				setLoading(false);
                Swal.fire("Not in Class", "Student not allocated in any class.", "error")
                navigate("/allocate");
			}
		};
		
		fetchUnits();
	},[]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading applications form...</div>;
	}

    return (
        <div className="px-6 bg-blue-800 dark:bg-gray-800 py-4 gap-1 md:gap-1 sm:gap-1 shadow-lg rounded-lg dark:border dark:border-gray-800 border border-brand-300 border-blur">
            <h4 className="text-lg font-semibold text-white dark:text-white/90 lg:mb-6">
				Unit(s)
			</h4>
			<div className="max-w-full overflow-x-auto">
                <Table>  
                    {/* Table Header */}
                    <TableHeader className="border-blue-800 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-bold text-yellow-400 text-start text-theme-sm dark:text-gray-400"
                            >
                                Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 text-end font-bold text-yellow-400 text-theme-sm dark:text-gray-400"
                            >
                                Code
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}

                    <TableBody className="overflow-hidden scrollbar-hide divide-y divide-gray-100 dark:divide-gray-800">
                            {units.map((unit) => (
                                <TableRow>
									<TableCell className="py-3 text-white text-theme-sm font-bold dark:text-gray-400">
										{unit.name}
									</TableCell>

									<TableCell className="py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
										<span className="text-white text-theme-xs dark:text-gray-400">
											{unit.uncode}
										</span>
									</TableCell>
                                
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
};
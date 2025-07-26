import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table";
import axios from "axios";
import {  PiggyBankIcon } from "lucide-react";
import { SearchButton } from "../../components/dashboard/SearchButton";
import Pagination from "../../components/ui/pagination";

import debounce from "lodash.debounce";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import FeePayment from "./RecordFee";

export interface Reciepts{
    id: number;
    trans_id: string;
    regno: string;
    passport: string;
    fname: string;
    mname: string;
    sname: string;
    unit_name: string;
    class_name: string;
    year_name: string;
    intake_name: string;
    wallet_name: string;
    wallet_type: string;
    amount: string;
    dop: string;
}

export default function Transactions() {
    const token = localStorage.getItem("access");

    const { isOpen, openModal, closeModal } = useModal();


    const [reciepts, setReciepts] = useState<Reciepts[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchReciepts = debounce(async (searchTerm, page=1) => {
        try {
            const response = await axios.get(`/api/receipts/?search=${searchTerm}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPage(response.data.page);
            setReciepts(response.data.results);
        setTotalPages(response.data.total_pages || response.data.num_pages || 1);
        } catch (error) {
            console.error("Failed to fetch receipts", error);
        }
    }, 100);

    useEffect(() => {
        fetchReciepts(searchTerm, page);
    }, [page, searchTerm]);

    const onSubmit = () => {
		fetchReciepts(searchTerm, page);
		closeModal();
	}

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Reciepts
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchButton onSearch={setSearchTerm} />
                        <button 
                            onClick={openModal}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <PiggyBankIcon />
                            Recieve Payment
                        </button>
                    </div>
                </div>
                
                <div className="max-w-full overflow-x-auto relative overflow-hidden">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Reciept No.
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Student
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Term
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Amount
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody 
                            className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                        >
                            {reciepts.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Reciept found.....</div>
								</TableRow>
							) : (
                                reciepts.map((reciept) => (
                                    <TableRow key={reciept.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {reciept.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {reciept.fname} {reciept.mname[0]}. {reciept.sname}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {reciept.regno}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {reciept.year_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {reciept.intake_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        KES. {reciept.amount}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {reciept.trans_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Pay Fee
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <FeePayment onSubmit={onSubmit} />
                    
                </div>
            </Modal>
            
        </>
    );
  }
  
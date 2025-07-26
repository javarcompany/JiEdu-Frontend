import Badge from "../../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { formatCurrencyShort } from "../../../utils/format";

type TransactionRow = {
    date: string;
    id: string;
    wallet: string;
    ref_id: string;
    payer: string;
    amount: string;
    account_number: string;
    status: string
};

type TransactionLogProps = {
    transactions: TransactionRow[];
};

export default function TransactionLogs ({ transactions }: TransactionLogProps ) {

    return (
        <div className="overflow-auto mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">

            <Table>
                
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 bg-blue-800 dark:border-white/[0.05]">
                    <TableRow>
                        {["Date", "Wallet", "Reference", "Amount", "Payer", "Account No.", "Status"].map((title, i) => (
                            <TableCell
                                key={i}
                                isHeader
                                className="px-5 py-3 font-medium text-white text-start text-theme-xs"
                            >
                                {title}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody 
                    className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
                >
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="p-4 text-sm text-gray-500">
                                No transaction log found...
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transa) => (
                            <TableRow key={transa.id}>  

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                {transa.date}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {transa.wallet}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                {transa.ref_id}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                Ksh. {formatCurrencyShort(transa.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                {transa.payer}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                {transa.account_number}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="md"
                                        color={
                                            transa.status === "Success"
                                            ? "success"

                                            : transa.status === "Pending"
                                            ? "warning"
                                            
                                            : "error"
                                        }
                                    >
                                        {transa.status}
                                    </Badge>
                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

        </div>
    );
};
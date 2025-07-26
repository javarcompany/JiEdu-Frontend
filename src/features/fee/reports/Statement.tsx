import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import React from "react";

type RecordDetail = {
    detail: string;
    paid_in: string | null;
    paid_out: string | null;
    balance: string;
    [key: string]:
        | string
        | null
        | {
            paid_out: string;
            balance: string;
        };
};

type StatementRow = {
    transaction_id: string;
    date: string;
    record: RecordDetail;
};

type FeeStatementProps = {
    statement: StatementRow[];
};

export default function FeeStatement({ statement }: FeeStatementProps) {
    return (
        <div className="overflow-auto mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 bg-blue-800 dark:border-white/[0.05]">
                    <TableRow>
                        {["Transaction ID", "Date", "Details", "Paid In", "Paid Out", "Balance"].map((title, i) => (
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
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
                    {statement.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="p-4 text-sm text-gray-500">
                                No Statement found...
                            </TableCell>
                        </TableRow>
                    ) : (
                    statement.map((entry, index) => {
                        const { transaction_id, date, record } = entry;

                        // Get keys that are NOT 'detail', 'paid_in', 'paid_out', 'balance'
                        const mainKeys = ["detail", "paid_in", "paid_out", "balance"];
                        const voteheads = Object.keys(record).filter((key) => !mainKeys.includes(key));

                        const isInvoice = voteheads.length === 0;

                        return (
                            <React.Fragment key={index}>
                                {isInvoice ? (
                                    // === Invoice Row ===
                                    <TableRow>
                                        <TableCell className="px-5 py-4 text-theme-sm  whitespace-normal break-words max-w-xs">{transaction_id}</TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">{date}</TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">{record.detail}</TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">{record.paid_in ? `KES ${record.paid_in}` : ""}</TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">{record.paid_out ? `KES ${record.paid_out}` : ""}</TableCell>
                                        <TableCell className="px-4 py-3 text-theme-sm">{record.balance ? `KES ${record.balance}` : ""}</TableCell>
                                    </TableRow>
                                ) : (
                                <>
                                    {/* === First Row of Receipt Transactions (with merged transaction ID, date, paid_in) === */}
                                    <TableRow>
                                        <TableCell rowSpan={voteheads.length} className="px-5 py-4 font-sm text-gray-800 dark:text-white text-theme-sm">
                                            {transaction_id}
                                        </TableCell>

                                        <TableCell rowSpan={voteheads.length} className="px-4 py-3 text-gray-600 dark:text-white/80  text-theme-sm">
                                            {date}
                                        </TableCell>

                                        <TableCell className="px-4 py-3  text-theme-sm">
                                            {voteheads[0]}
                                        </TableCell>
                                        
                                        <TableCell rowSpan={voteheads.length} className="px-4 py-3 text-blue-600 font-semibold  text-theme-sm">
                                            {record.paid_in ? `KES ${record.paid_in}` : ""}
                                        </TableCell>

                                        <TableCell className="px-4 py-3  text-theme-sm">
                                            {typeof record[voteheads[0]] === "object" && record[voteheads[0]] !== null
                                                ? `KES ${(record[voteheads[0]] as { paid_out: string; balance: string }).paid_out}`
                                                : ""}
                                        </TableCell>

                                        <TableCell className="px-4 py-3  text-theme-sm">
                                            {typeof record[voteheads[0]] === "object" && record[voteheads[0]] !== null
                                                ? `KES ${(record[voteheads[0]] as { paid_out: string; balance: string }).balance}`
                                                : ""}
                                        </TableCell>
                                    </TableRow>

                                    {/* === Remaining Votehead Rows === */}
                                    {voteheads.slice(1).map((vh, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="px-4 py-3  text-theme-sm">{vh}</TableCell>

                                            <TableCell className="px-4 py-3  text-theme-sm">
                                                {typeof record[vh] === "object" && record[vh] !== null
                                                    ? `KES ${(record[vh] as { paid_out: string }).paid_out}`
                                                    : ""}
                                            </TableCell>

                                            <TableCell className="px-4 py-3  text-theme-sm">
                                                {typeof record[vh] === "object" && record[vh] !== null
                                                    ? `KES ${(record[vh] as { balance: string }).balance}`
                                                    : ""}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                                )}
                            </React.Fragment>
                        );
                    })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

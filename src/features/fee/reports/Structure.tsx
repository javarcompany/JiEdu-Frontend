import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";

type FeeItem = {
    account: string;
    amount: number;
};

type FeeStructureProps = {
    structure: FeeItem[];
};

export default function FeeStructure({ structure }: FeeStructureProps) {

    const total = structure.reduce((sum, item) => sum + Number(item.amount), 0);
    const formatAmount = (amount: number | string) =>
        Number(amount).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
    });

    return (
        <div className="overflow-auto mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 bg-blue-800 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell
                            isHeader
                            className="px-5 py-5 font-medium text-white text-start text-theme-sm"
                        >
                            VOTEHEAD
                        </TableCell>
                        <TableCell
                            isHeader
                            className="px-5 py-5 font-medium text-white text-end text-theme-sm"
                        >
                            AMOUNT (KES)
                        </TableCell>
                    </TableRow>
                </TableHeader>
                
                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out">
                    {structure.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="p-4 text-sm text-gray-500">
                                No Fee Structure found...
                            </TableCell>
                        </TableRow>
                    ) : (
                    structure.map((item) => (
                        <TableRow>
                            <TableCell className="px-5 py-4 font-sm text-gray-800 dark:text-white text-theme-sm">
                                {item.account}
                            </TableCell>
                            <TableCell className="px-5 py-4 font-sm text-gray-800 text-end dark:text-white text-theme-sm">
                                KES {formatAmount(item.amount)}
                            </TableCell>
                        </TableRow>
                    )))}
                </TableBody>
                <TableHeader className="bg-blue-800">
                    <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-5 font-medium text-white text-start text-theme-md"
                            >
                                TOTAL
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-5 font-medium text-white text-end text-theme-md"
                            >
                                KES {formatAmount(total)}
                            </TableCell>
                    </TableRow>
                </TableHeader>
            </Table>
        </div>
    );
}

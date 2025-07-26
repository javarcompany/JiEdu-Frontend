
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
        <div className="p-6 rounded-lg shadow-md w-full mx-auto">

            <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-800 text-white">
                    <tr>
                        <th className="text-left px-4 py-2">Votehead</th>
                        <th className="text-right px-4 py-2">Amount (KES)</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700 text-gray-800 dark:text-white">
                    {structure.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-4 py-3">{item.account}</td>
                            <td className="px-4 py-3 text-right">KES {formatAmount(item.amount)}</td>
                        </tr>
                    ))}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-800">
                        <td className="px-4 py-3">Total</td>
                        <td className="px-4 py-3 text-right">KES {formatAmount(total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

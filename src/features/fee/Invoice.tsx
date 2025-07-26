import { useState } from "react";
import { GroupedModuleFees } from "./reports/Course/BottomActions";

type InvoiceProps = {
  groupedFees: GroupedModuleFees;
};

export default function ModuleFeeView({ groupedFees }: InvoiceProps) {
  const modules = Object.keys(groupedFees);
  const [selectedModule, setSelectedModule] = useState<string | null>(modules[0] || null);

  const selectedData = selectedModule ? groupedFees[selectedModule] : null;

  return (
    <div className="flex h-[500px] rounded-lg shadow-md overflow-hidden border dark:border-gray-800">
      {/* Module Sidebar */}
      <div className="w-1/6 border-r dark:border-gray-700 overflow-y-auto">
        <div className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
          Modules
        </div>
        {modules.map((mod, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedModule(mod)}
            className={`p-3 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 ${
              selectedModule === mod ? "bg-blue-100 dark:bg-gray-800" : ""
            }`}
          >
            {mod}
          </div>
        ))}
      </div>

      {/* Fee Table View */}
      <div className="w-5/6 p-6 overflow-y-auto">
        {selectedData ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Module {selectedModule}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing fee structures for this module.
              </p>
            </div>

            <table className="w-full text-sm text-left border-t border-gray-200 dark:border-gray-700">
              <thead className="text-xs text-gray-600 dark:text-gray-300 uppercase">
                <tr>
                  <th className="py-2 px-8 py-8">Votehead</th>
                  <th className="py-2 px-8 py-8 text-end">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 dark:text-white divide-y divide-gray-100 dark:divide-gray-800">
                {selectedData.particulars.map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-8">{p.votehead}</td>
                    <td className="py-2 px-8 text-end">KES {p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-blue-800 border-gray-200 dark:border-gray-700">
                <tr>
                  <td className="py-3 px-8 font-bold text-white">Total</td>
                  <td className="py-3 px-8 text-end font-bold text-white">KES {selectedData.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Select a module to view its fee structure</p>
        )}
      </div>
    </div>
  );
}

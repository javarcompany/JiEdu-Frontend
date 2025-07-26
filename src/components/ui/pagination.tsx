import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Button from "./button/Button";

const Pagination = ({ currentPage, totalPages, onPageChange }: {currentPage: number, totalPages: number, onPageChange: React.Dispatch<React.SetStateAction<number>>} ) => {
    const goToPrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
    
    console.log("Current Page:", currentPage, "Total Pages: ", totalPages)

    return (
        <div className="flex justify-between mt-3 mb-4">
            <Button
                startIcon = {<ArrowLeftIcon className="w-5 h-5" />}
                className="p-5 border border-gray-500 disabled:bg-red-900 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                disabled={currentPage === 1} 
                onClick={goToPrevious}
            >
                Previous
            </Button>

            <span>Page {currentPage} of {totalPages}</span>

            <Button
                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                disabled={currentPage === totalPages} 
                onClick={goToNext}
                endIcon = {<ArrowRightIcon className="w-5 h-5" />}
            >
                Next
            </Button>
        </div>
    )
};

export default Pagination;
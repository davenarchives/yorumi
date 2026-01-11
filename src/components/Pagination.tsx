interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function Pagination({ currentPage, lastPage, onPageChange, isLoading }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-4 mt-12 pb-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-white/5 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
                Previous
            </button>
            <span className="text-sm text-gray-400">
                Page {currentPage} of {lastPage}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage || isLoading}
                className="px-4 py-2 bg-white/5 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
                Next
            </button>
        </div>
    );
}

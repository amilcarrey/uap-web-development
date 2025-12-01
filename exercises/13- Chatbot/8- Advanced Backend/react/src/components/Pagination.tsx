

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    }

    return (
        <div className="pagination flex items-center justify-center gap-2 mt-4">
            <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                First
            </button>
            <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="mx-2">
                Page {currentPage} of {totalPages}
            </span>
            <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Next
            </button>
            <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Last
            </button>
        </div>
    );
}







// import { usePagination } from '../context/PaginationContext';


// // interface PaginationProps {
// //     currentPage: number;
// //     totalPages: number;
// //     onPageChange: (page: number) => void;
// // }

// export function Pagination() { //{ currentPage, totalPages, onPageChange }: PaginationProps

//     const { currentPage, setCurrentPage, totalPages } = usePagination();

//     const handlePageChange = (page: number) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);

//     };

//     return (
//         <div className="pagination flex items-center justify-center gap-2 mt-4">
//         <button 
//             onClick={() => handlePageChange(1)} 
//             disabled={currentPage === 1}
//             className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
//         >
//             First
//         </button>
//         <button 
//             onClick={() => handlePageChange(currentPage - 1)} 
//             disabled={currentPage === 1}
//             className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
//         >
//             Previous
//         </button>
//         <span className="mx-2">
//             Page {currentPage} of {totalPages}
//         </span>
//         <button 
//             onClick={() => handlePageChange(currentPage + 1)} 
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
//         >
//             Next
//         </button>
//         <button 
//             onClick={() => handlePageChange(totalPages)} 
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
//         >
//             Last
//         </button>
//     </div>
//     );

// }
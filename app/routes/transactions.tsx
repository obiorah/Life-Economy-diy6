import type { MetaFunction } from "@remix-run/node";
import { useState, useMemo, useCallback, useEffect } from "react"; // Added useEffect
import { Link } from "@remix-run/react";
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin

// Extend jsPDF interface for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}


export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Transactions" },
    { name: "description", content: "View your transaction history" },
  ];
};

// --- SVG Icons (Keep existing icons) ---
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const TableIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

// --- Transaction Type Definition ---
interface Transaction {
  id: string;
  date: string; // Using string for simplicity, ideally Date object
  narration: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

// --- Dummy Transaction Data ---
const dummyTransactions: Transaction[] = [
  { id: "1", date: "2024-07-26 10:00:00", narration: "Initial Balance", debit: null, credit: 1000.00, balance: 1000.00 },
  { id: "2", date: "2024-07-26 11:30:00", narration: "Transfer to Bob", debit: 50.00, credit: null, balance: 950.00 },
  { id: "3", date: "2024-07-27 09:15:00", narration: "Received from Alice", debit: null, credit: 200.00, balance: 1150.00 },
  { id: "4", date: "2024-07-27 14:00:00", narration: "Grocery Shopping", debit: 75.50, credit: null, balance: 1074.50 },
  { id: "5", date: "2024-07-28 16:45:00", narration: "Salary Deposit", debit: null, credit: 2500.00, balance: 3574.50 },
  { id: "6", date: "2024-07-29 08:00:00", narration: "Rent Payment", debit: 1200.00, credit: null, balance: 2374.50 },
  { id: "7", date: "2024-07-30 12:00:00", narration: "Lunch with friends", debit: 35.00, credit: null, balance: 2339.50 },
  { id: "8", date: "2024-07-31 18:00:00", narration: "Online Course Subscription", debit: 29.99, credit: null, balance: 2309.51 },
  { id: "9", date: "2024-08-01 09:00:00", narration: "Received payment for freelance work", debit: null, credit: 500.00, balance: 2809.51 },
  { id: "10", date: "2024-08-01 15:30:00", narration: "Utility Bill", debit: 110.25, credit: null, balance: 2699.26 },
  { id: "11", date: "2024-08-02 10:15:00", narration: "Transfer from Savings", debit: null, credit: 300.00, balance: 2999.26 },
  { id: "12", date: "2024-08-03 19:00:00", narration: "Dinner at Restaurant", debit: 85.00, credit: null, balance: 2914.26 },
];

const ITEMS_PER_PAGE = 5;

export default function Transactions() {
  const [transactions] = useState<Transaction[]>(dummyTransactions); // Base data
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null); // State for CSV download link
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null); // State for PDF download link

  // --- Cleanup Blob URLs on component unmount ---
  useEffect(() => {
    // Store the current URLs in refs to access them in the cleanup function
    // This avoids the cleanup function capturing stale state values
    const currentCsvUrl = csvDownloadUrl;
    const currentPdfUrl = pdfDownloadUrl;
    return () => {
      if (currentCsvUrl) {
        console.log("[Cleanup] Revoking CSV URL:", currentCsvUrl);
        URL.revokeObjectURL(currentCsvUrl);
      }
      if (currentPdfUrl) {
        console.log("[Cleanup] Revoking PDF URL:", currentPdfUrl);
        URL.revokeObjectURL(currentPdfUrl);
      }
    };
  }, [csvDownloadUrl, pdfDownloadUrl]); // Re-run effect when URLs change


  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "";
    return numAmount.toFixed(2);
  };


  const filteredTransactions = useMemo(() => {
    // Revoke URLs when filters change, forcing regeneration
    // This logic is moved to an effect below to avoid side effects in useMemo
    let filtered = transactions;
    if (startDate) {
      try {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (!isNaN(start.getTime())) {
          filtered = filtered.filter(tx => {
            const txDate = new Date(tx.date);
            return !isNaN(txDate.getTime()) && txDate >= start;
          });
        }
      } catch (e) { console.error("Invalid start date:", e); }
    }
    if (endDate) {
       try {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
         if (!isNaN(end.getTime())) {
          filtered = filtered.filter(tx => {
             const txDate = new Date(tx.date);
            return !isNaN(txDate.getTime()) && txDate <= end;
          });
        }
      } catch (e) { console.error("Invalid end date:", e); }
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.narration.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return filtered;
  }, [transactions, startDate, endDate, searchTerm]);

  // Effect to revoke URLs when filters change
  useEffect(() => {
    if (csvDownloadUrl) {
      console.log("[Filter Change] Revoking old CSV URL:", csvDownloadUrl);
      URL.revokeObjectURL(csvDownloadUrl);
      setCsvDownloadUrl(null);
    }
    if (pdfDownloadUrl) {
      console.log("[Filter Change] Revoking old PDF URL:", pdfDownloadUrl);
      URL.revokeObjectURL(pdfDownloadUrl);
      setPdfDownloadUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, searchTerm]); // Only run when filters change


   const [previousFilteredLength, setPreviousFilteredLength] = useState(filteredTransactions.length);
   useMemo(() => {
     if (filteredTransactions.length !== previousFilteredLength) {
       setCurrentPage(1);
       setPreviousFilteredLength(filteredTransactions.length);
     }
   }, [filteredTransactions, previousFilteredLength]);


  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // --- Export Functions using Visible Link ---
  const handleExportCSV = useCallback(() => {
    console.log("[Export CSV] Started.");
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      console.log("[Export CSV] Aborted: No transactions.");
      return;
    }
    try {
      // Revoke previous CSV URL if it exists *before* creating new one
      if (csvDownloadUrl) {
        console.log("[Export CSV] Revoking previous CSV URL:", csvDownloadUrl);
        URL.revokeObjectURL(csvDownloadUrl);
        // setCsvDownloadUrl(null); // Don't set to null here, wait for new URL
      }
       // Also revoke PDF URL if user switches export type
      if (pdfDownloadUrl) {
        console.log("[Export CSV] Revoking existing PDF URL:", pdfDownloadUrl);
        URL.revokeObjectURL(pdfDownloadUrl);
        setPdfDownloadUrl(null); // Clear the *other* type's URL state
      }


      console.log(`[Export CSV] Processing ${filteredTransactions.length} transactions.`);
      const csvData = Papa.unparse(filteredTransactions.map(tx => ({
        Date: tx.date,
        Narration: tx.narration,
        Debit: formatCurrency(tx.debit),
        Credit: formatCurrency(tx.credit),
        Balance: formatCurrency(tx.balance),
      })), { header: true });
      console.log("[Export CSV] CSV data generated.");

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      console.log("[Export CSV] Blob created.");
      const url = URL.createObjectURL(blob);
      console.log("[Export CSV] New Blob URL created:", url);

      // Set the URL in state to render the visible link
      setCsvDownloadUrl(url); // This triggers the useEffect for cleanup later
      console.log("[Export CSV] CSV download URL set in state.");

    } catch (error) {
        console.error("[Export CSV] Failed:", error);
        alert("An error occurred while exporting CSV data.");
        setCsvDownloadUrl(null); // Clear URL on error
    } finally {
        console.log("[Export CSV] Finished.");
    }
  }, [filteredTransactions, csvDownloadUrl, pdfDownloadUrl]); // Keep dependencies

  const handleExportPDF = useCallback(() => {
    console.log("[Export PDF] Started.");
     if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      console.log("[Export PDF] Aborted: No transactions.");
      return;
    }
    try {
      // Revoke previous PDF URL if it exists *before* creating new one
      if (pdfDownloadUrl) {
        console.log("[Export PDF] Revoking previous PDF URL:", pdfDownloadUrl);
        URL.revokeObjectURL(pdfDownloadUrl);
        // setPdfDownloadUrl(null); // Don't set to null here, wait for new URL
      }
      // Also revoke CSV URL if user switches export type
      if (csvDownloadUrl) {
        console.log("[Export PDF] Revoking existing CSV URL:", csvDownloadUrl);
        URL.revokeObjectURL(csvDownloadUrl);
        setCsvDownloadUrl(null); // Clear the *other* type's URL state
      }

      console.log(`[Export PDF] Processing ${filteredTransactions.length} transactions.`);
      console.log("[Export PDF] Creating jsPDF instance...");
      const doc = new jsPDF();
      doc.text("Transaction History", 14, 15);
      console.log("[Export PDF] Generating PDF table using autoTable...");
      doc.autoTable({
        head: [['Date', 'Narration', 'Debit', 'Credit', 'Balance']],
        body: filteredTransactions.map(tx => [
          tx.date,
          tx.narration,
          formatCurrency(tx.debit),
          formatCurrency(tx.credit),
          formatCurrency(tx.balance),
        ]),
        startY: 20,
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 35 }, 1: { cellWidth: 'auto'},
          2: { halign: 'right', cellWidth: 25 }, 3: { halign: 'right', cellWidth: 25 },
          4: { halign: 'right', cellWidth: 30 },
        },
      });
      console.log("[Export PDF] autoTable finished.");

      console.log("[Export PDF] Generating PDF Blob...");
      const pdfBlob = doc.output('blob');
      console.log("[Export PDF] Blob created.");
      const url = URL.createObjectURL(pdfBlob);
      console.log("[Export PDF] New Blob URL created:", url);

      // Set the URL in state to render the visible link
      setPdfDownloadUrl(url); // This triggers the useEffect for cleanup later
      console.log("[Export PDF] PDF download URL set in state.");

    } catch (error) {
        console.error("[Export PDF] Failed:", error);
        alert("An error occurred while exporting PDF data.");
        setPdfDownloadUrl(null); // Clear URL on error
    } finally {
        console.log("[Export PDF] Finished.");
    }
  }, [filteredTransactions, pdfDownloadUrl, csvDownloadUrl]); // Keep dependencies
  // --- End of Visible Link Export Functions ---

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredTransactions.length);


  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>

      {/* --- Filters and Export Section --- */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && e.target.value > endDate) {
                    setEndDate("");
                }
            }}
            className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="Start Date"
          />
          <span>-</span>
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="End Date"
          />
        </div>

        {/* Keyword Search */}
        <div className="relative flex-grow max-w-xs">
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search narration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border bg-white py-1.5 pl-8 pr-2 text-sm shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="Search transactions"
          />
        </div>

        {/* Export Buttons and Links */}
        <div className="flex flex-col items-end gap-1 ml-auto">
           <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                disabled={filteredTransactions.length === 0}
                className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                aria-label="Generate CSV Export Link"
              >
                <FileTextIcon className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                disabled={filteredTransactions.length === 0}
                className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                aria-label="Generate PDF Export Link"
              >
                <DownloadIcon className="h-4 w-4" />
                Export PDF
              </button>
           </div>
           {/* Visible Download Links */}
           <div className="flex gap-4 text-sm h-5"> {/* Added fixed height to prevent layout shift */}
             {csvDownloadUrl && (
               <a
                 href={csvDownloadUrl}
                 download="transactions.csv"
                 className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                 // Optional: Add onClick handler if needed for analytics or immediate cleanup
                 // onClick={() => { console.log('CSV Download link clicked'); }}
               >
                 Click to Download CSV
               </a>
             )}
             {pdfDownloadUrl && (
               <a
                 href={pdfDownloadUrl}
                 download="transactions.pdf"
                 className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                 // Optional: Add onClick handler if needed for analytics or immediate cleanup
                 // onClick={() => { console.log('PDF Download link clicked'); }}
               >
                 Click to Download PDF
               </a>
             )}
           </div>
        </div>
      </div>

      {/* --- Transactions Table --- */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Narration</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Debit</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Credit</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{tx.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{tx.narration}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-600 dark:text-red-400">{formatCurrency(tx.debit)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">{formatCurrency(tx.credit)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-200">{formatCurrency(tx.balance)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {transactions.length === 0 ? "No transactions available." : "No transactions found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            {filteredTransactions.length > 0 ?
              `Showing ${startIndex + 1} to ${endIndex} of ${filteredTransactions.length} results` :
              'Showing 0 results'
            }
          </span>
          <div className="flex gap-1">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="rounded border bg-white px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded border bg-white px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

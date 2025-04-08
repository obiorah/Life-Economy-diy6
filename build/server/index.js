import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Link, NavLink, Outlet, Meta, Links, ScrollRestoration, Scripts, useActionData, useNavigation, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function useUserRole() {
  return "Super Admin";
}
function Header() {
  const userRole = useUserRole();
  return /* @__PURE__ */ jsxs("header", { className: "flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsx(DollarSignIcon, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsx("span", { children: "Life Economy" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-4 text-sm font-medium md:flex", children: [
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/dashboard",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/transactions",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Transactions"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/transfer",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Transfer"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/admin",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Admin"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/management",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Management"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/settings",
            className: ({ isActive }) => cn(
              "hover:text-gray-900 dark:hover:text-gray-50",
              isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-400"
            ),
            children: "Settings"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border p-2 text-sm", children: [
      /* @__PURE__ */ jsx("span", { children: "Jane Doe" }),
      /* @__PURE__ */ jsxs("span", { className: "rounded-sm bg-gray-200 px-1 text-xs dark:bg-gray-700", children: [
        userRole,
        " "
      ] }),
      /* @__PURE__ */ jsx(LogOutIcon, { className: "h-4 w-4" })
    ] }) })
  ] });
}
function DollarSignIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "2", y2: "22" }),
        /* @__PURE__ */ jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
      ]
    }
  );
}
function LogOutIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
        /* @__PURE__ */ jsx("polyline", { points: "16 17 21 12 16 7" }),
        /* @__PURE__ */ jsx("line", { x1: "21", x2: "9", y1: "12", y2: "12" })
      ]
    }
  );
}
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full bg-gray-50 dark:bg-gray-950", children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 md:p-6", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const meta$5 = () => {
  return [
    { title: "Life Economy - Transactions" },
    { name: "description", content: "View your transaction history" }
  ];
};
const DownloadIcon$2 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    ...props,
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
      /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
    ]
  }
);
const FileTextIcon$1 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    ...props,
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ jsx("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
      /* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
      /* @__PURE__ */ jsx("line", { x1: "16", x2: "8", y1: "13", y2: "13" }),
      /* @__PURE__ */ jsx("line", { x1: "16", x2: "8", y1: "17", y2: "17" }),
      /* @__PURE__ */ jsx("line", { x1: "10", x2: "8", y1: "9", y2: "9" })
    ]
  }
);
const SearchIcon$3 = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    ...props,
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
    ]
  }
);
const CalendarIcon = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    ...props,
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ jsx("path", { d: "M8 2v4" }),
      /* @__PURE__ */ jsx("path", { d: "M16 2v4" }),
      /* @__PURE__ */ jsx("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M3 10h18" })
    ]
  }
);
const dummyTransactions = [
  { id: "1", date: "2024-07-26 10:00:00", narration: "Initial Balance", debit: null, credit: 1e3, balance: 1e3 },
  { id: "2", date: "2024-07-26 11:30:00", narration: "Transfer to Bob", debit: 50, credit: null, balance: 950 },
  { id: "3", date: "2024-07-27 09:15:00", narration: "Received from Alice", debit: null, credit: 200, balance: 1150 },
  { id: "4", date: "2024-07-27 14:00:00", narration: "Grocery Shopping", debit: 75.5, credit: null, balance: 1074.5 },
  { id: "5", date: "2024-07-28 16:45:00", narration: "Salary Deposit", debit: null, credit: 2500, balance: 3574.5 },
  { id: "6", date: "2024-07-29 08:00:00", narration: "Rent Payment", debit: 1200, credit: null, balance: 2374.5 },
  { id: "7", date: "2024-07-30 12:00:00", narration: "Lunch with friends", debit: 35, credit: null, balance: 2339.5 },
  { id: "8", date: "2024-07-31 18:00:00", narration: "Online Course Subscription", debit: 29.99, credit: null, balance: 2309.51 },
  { id: "9", date: "2024-08-01 09:00:00", narration: "Received payment for freelance work", debit: null, credit: 500, balance: 2809.51 },
  { id: "10", date: "2024-08-01 15:30:00", narration: "Utility Bill", debit: 110.25, credit: null, balance: 2699.26 },
  { id: "11", date: "2024-08-02 10:15:00", narration: "Transfer from Savings", debit: null, credit: 300, balance: 2999.26 },
  { id: "12", date: "2024-08-03 19:00:00", narration: "Dinner at Restaurant", debit: 85, credit: null, balance: 2914.26 }
];
const ITEMS_PER_PAGE = 5;
function Transactions() {
  const [transactions] = useState(dummyTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [csvDownloadUrl, setCsvDownloadUrl] = useState(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null);
  useEffect(() => {
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
  }, [csvDownloadUrl, pdfDownloadUrl]);
  const formatCurrency = (amount) => {
    if (amount === null) return "";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "";
    return numAmount.toFixed(2);
  };
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (startDate) {
      try {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (!isNaN(start.getTime())) {
          filtered = filtered.filter((tx) => {
            const txDate = new Date(tx.date);
            return !isNaN(txDate.getTime()) && txDate >= start;
          });
        }
      } catch (e) {
        console.error("Invalid start date:", e);
      }
    }
    if (endDate) {
      try {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (!isNaN(end.getTime())) {
          filtered = filtered.filter((tx) => {
            const txDate = new Date(tx.date);
            return !isNaN(txDate.getTime()) && txDate <= end;
          });
        }
      } catch (e) {
        console.error("Invalid end date:", e);
      }
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) => tx.narration.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return filtered;
  }, [transactions, startDate, endDate, searchTerm]);
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
  }, [startDate, endDate, searchTerm]);
  const [previousFilteredLength, setPreviousFilteredLength] = useState(filteredTransactions.length);
  useMemo(() => {
    if (filteredTransactions.length !== previousFilteredLength) {
      setCurrentPage(1);
      setPreviousFilteredLength(filteredTransactions.length);
    }
  }, [filteredTransactions, previousFilteredLength]);
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex2 = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex2 = startIndex2 + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex2, endIndex2);
  }, [filteredTransactions, currentPage]);
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleExportCSV = useCallback(() => {
    console.log("[Export CSV] Started.");
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      console.log("[Export CSV] Aborted: No transactions.");
      return;
    }
    try {
      if (csvDownloadUrl) {
        console.log("[Export CSV] Revoking previous CSV URL:", csvDownloadUrl);
        URL.revokeObjectURL(csvDownloadUrl);
      }
      if (pdfDownloadUrl) {
        console.log("[Export CSV] Revoking existing PDF URL:", pdfDownloadUrl);
        URL.revokeObjectURL(pdfDownloadUrl);
        setPdfDownloadUrl(null);
      }
      console.log(`[Export CSV] Processing ${filteredTransactions.length} transactions.`);
      const csvData = Papa.unparse(filteredTransactions.map((tx) => ({
        Date: tx.date,
        Narration: tx.narration,
        Debit: formatCurrency(tx.debit),
        Credit: formatCurrency(tx.credit),
        Balance: formatCurrency(tx.balance)
      })), { header: true });
      console.log("[Export CSV] CSV data generated.");
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      console.log("[Export CSV] Blob created.");
      const url = URL.createObjectURL(blob);
      console.log("[Export CSV] New Blob URL created:", url);
      setCsvDownloadUrl(url);
      console.log("[Export CSV] CSV download URL set in state.");
    } catch (error) {
      console.error("[Export CSV] Failed:", error);
      alert("An error occurred while exporting CSV data.");
      setCsvDownloadUrl(null);
    } finally {
      console.log("[Export CSV] Finished.");
    }
  }, [filteredTransactions, csvDownloadUrl, pdfDownloadUrl]);
  const handleExportPDF = useCallback(() => {
    console.log("[Export PDF] Started.");
    if (filteredTransactions.length === 0) {
      alert("No transactions to export.");
      console.log("[Export PDF] Aborted: No transactions.");
      return;
    }
    try {
      if (pdfDownloadUrl) {
        console.log("[Export PDF] Revoking previous PDF URL:", pdfDownloadUrl);
        URL.revokeObjectURL(pdfDownloadUrl);
      }
      if (csvDownloadUrl) {
        console.log("[Export PDF] Revoking existing CSV URL:", csvDownloadUrl);
        URL.revokeObjectURL(csvDownloadUrl);
        setCsvDownloadUrl(null);
      }
      console.log(`[Export PDF] Processing ${filteredTransactions.length} transactions.`);
      console.log("[Export PDF] Creating jsPDF instance...");
      const doc = new jsPDF();
      doc.text("Transaction History", 14, 15);
      console.log("[Export PDF] Generating PDF table using autoTable...");
      doc.autoTable({
        head: [["Date", "Narration", "Debit", "Credit", "Balance"]],
        body: filteredTransactions.map((tx) => [
          tx.date,
          tx.narration,
          formatCurrency(tx.debit),
          formatCurrency(tx.credit),
          formatCurrency(tx.balance)
        ]),
        startY: 20,
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: "auto" },
          2: { halign: "right", cellWidth: 25 },
          3: { halign: "right", cellWidth: 25 },
          4: { halign: "right", cellWidth: 30 }
        }
      });
      console.log("[Export PDF] autoTable finished.");
      console.log("[Export PDF] Generating PDF Blob...");
      const pdfBlob = doc.output("blob");
      console.log("[Export PDF] Blob created.");
      const url = URL.createObjectURL(pdfBlob);
      console.log("[Export PDF] New Blob URL created:", url);
      setPdfDownloadUrl(url);
      console.log("[Export PDF] PDF download URL set in state.");
    } catch (error) {
      console.error("[Export PDF] Failed:", error);
      alert("An error occurred while exporting PDF data.");
      setPdfDownloadUrl(null);
    } finally {
      console.log("[Export PDF] Finished.");
    }
  }, [filteredTransactions, pdfDownloadUrl, csvDownloadUrl]);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredTransactions.length);
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4 md:p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Transaction History" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CalendarIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            placeholder: "Start Date",
            value: startDate,
            onChange: (e) => {
              setStartDate(e.target.value);
              if (endDate && e.target.value > endDate) {
                setEndDate("");
              }
            },
            className: "border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200",
            "aria-label": "Start Date"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "-" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            placeholder: "End Date",
            value: endDate,
            onChange: (e) => setEndDate(e.target.value),
            min: startDate,
            className: "border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200",
            "aria-label": "End Date"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-grow max-w-xs", children: [
        /* @__PURE__ */ jsx(SearchIcon$3, { className: "absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "search",
            placeholder: "Search narration...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full rounded border bg-white py-1.5 pl-8 pr-2 text-sm shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200",
            "aria-label": "Search transactions"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1 ml-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleExportCSV,
              disabled: filteredTransactions.length === 0,
              className: "inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500",
              "aria-label": "Generate CSV Export Link",
              children: [
                /* @__PURE__ */ jsx(FileTextIcon$1, { className: "h-4 w-4" }),
                "Export CSV"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleExportPDF,
              disabled: filteredTransactions.length === 0,
              className: "inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500",
              "aria-label": "Generate PDF Export Link",
              children: [
                /* @__PURE__ */ jsx(DownloadIcon$2, { className: "h-4 w-4" }),
                "Export PDF"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-sm h-5", children: [
          " ",
          csvDownloadUrl && /* @__PURE__ */ jsx(
            "a",
            {
              href: csvDownloadUrl,
              download: "transactions.csv",
              className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline",
              children: "Click to Download CSV"
            }
          ),
          pdfDownloadUrl && /* @__PURE__ */ jsx(
            "a",
            {
              href: pdfDownloadUrl,
              download: "transactions.pdf",
              className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline",
              children: "Click to Download PDF"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border dark:border-gray-700", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "Date" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "Narration" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "Debit" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "Credit" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "Balance" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900", children: paginatedTransactions.length > 0 ? paginatedTransactions.map((tx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800/50", children: [
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-200", children: tx.date }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-200", children: tx.narration }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right text-sm text-red-600 dark:text-red-400", children: formatCurrency(tx.debit) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right text-sm text-green-600 dark:text-green-400", children: formatCurrency(tx.credit) }),
        /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-200", children: formatCurrency(tx.balance) })
      ] }, tx.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400", children: transactions.length === 0 ? "No transactions available." : "No transactions found matching your criteria." }) }) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-400", children: filteredTransactions.length > 0 ? `Showing ${startIndex + 1} to ${endIndex} of ${filteredTransactions.length} results` : "Showing 0 results" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handlePreviousPage,
            disabled: currentPage === 1,
            className: "rounded border bg-white px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-500",
            "aria-label": "Go to previous page",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleNextPage,
            disabled: currentPage === totalPages || totalPages === 0,
            className: "rounded border bg-white px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-500",
            "aria-label": "Go to next page",
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Transactions,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const meta$4 = () => {
  return [
    { title: "Life Economy - Management" },
    { name: "description", content: "Manage the Life Economy system" }
  ];
};
function CurrencyIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "8" }),
        /* @__PURE__ */ jsx("line", { x1: "3", y1: "3", x2: "21", y2: "21" })
      ]
    }
  );
}
function BehaviorIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 1 0 10 10" }),
        /* @__PURE__ */ jsx("path", { d: "m16 16-3-3-3 3" }),
        /* @__PURE__ */ jsx("path", { d: "m16 8 3 3-6 6" })
      ]
    }
  );
}
function EconomyIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "2", y2: "22" }),
        /* @__PURE__ */ jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
      ]
    }
  );
}
function PlusCircleIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "8", y2: "16" }),
        /* @__PURE__ */ jsx("line", { x1: "8", x2: "16", y1: "12", y2: "12" })
      ]
    }
  );
}
function SearchIcon$2(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
      ]
    }
  );
}
function CheckCircleIcon$1(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
        /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })
      ]
    }
  );
}
function UserIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
      ]
    }
  );
}
function UsersIcon$1(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "4" }),
        /* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
        /* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
      ]
    }
  );
}
function ThumbsUpIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M7 10v12" }),
        /* @__PURE__ */ jsx("path", { d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" })
      ]
    }
  );
}
function ThumbsDownIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M17 14V2" }),
        /* @__PURE__ */ jsx("path", { d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" })
      ]
    }
  );
}
function EditIcon$2(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
        /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
      ]
    }
  );
}
function Trash2Icon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
        /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
        /* @__PURE__ */ jsx("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
        /* @__PURE__ */ jsx("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
      ]
    }
  );
}
function ToggleLeftIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "5", width: "22", height: "14", rx: "7", ry: "7" }),
        /* @__PURE__ */ jsx("circle", { cx: "8", cy: "12", r: "3" })
      ]
    }
  );
}
function ToggleRightIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "5", width: "22", height: "14", rx: "7", ry: "7" }),
        /* @__PURE__ */ jsx("circle", { cx: "16", cy: "12", r: "3" })
      ]
    }
  );
}
function XCircleIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
        /* @__PURE__ */ jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
      ]
    }
  );
}
function LinkIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
        /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
      ]
    }
  );
}
const MOCK_USERS = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" },
  { id: "user4", name: "Diana" }
];
const MOCK_GROUPS = [
  { id: "groupA", name: "Developers" },
  { id: "groupB", name: "Marketing" },
  { id: "groupC", name: "Support Team" }
];
function CurrencyManagementTab() {
  const [totalEssence, setTotalEssence] = useState(1e6);
  const [issuanceHistory, setIssuanceHistory] = useState([
    { id: "1", timestamp: /* @__PURE__ */ new Date("2023-10-26T10:00:00Z"), amount: 5e5, reason: "Initial Seed", issuedBy: "System" },
    { id: "2", timestamp: /* @__PURE__ */ new Date("2023-10-27T11:30:00Z"), amount: 5e5, reason: "Phase 1 Allocation", issuedBy: "Admin A" }
  ]);
  const [mintAmount, setMintAmount] = useState("");
  const [mintReason, setMintReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const handleMintCurrency = (event) => {
    event.preventDefault();
    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount to mint.");
      return;
    }
    const newRecord = {
      id: crypto.randomUUID(),
      // Simple unique ID for demo - OK in event handler
      timestamp: /* @__PURE__ */ new Date(),
      // OK in event handler
      amount,
      reason: mintReason || "Minted via console",
      issuedBy: "Current Admin"
      // Placeholder
    };
    setTotalEssence((prevTotal) => prevTotal + amount);
    setIssuanceHistory((prevHistory) => [newRecord, ...prevHistory]);
    setMintAmount("");
    setMintReason("");
  };
  const filteredHistory = useMemo(() => {
    if (!searchTerm) {
      return issuanceHistory;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return issuanceHistory.filter(
      (record) => record.reason.toLowerCase().includes(lowerCaseSearch) || record.issuedBy.toLowerCase().includes(lowerCaseSearch) || record.amount.toString().includes(lowerCaseSearch) || record.timestamp.toLocaleDateString().includes(lowerCaseSearch) || record.timestamp.toLocaleTimeString().includes(lowerCaseSearch)
    );
  }, [issuanceHistory, searchTerm]);
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-b-md dark:border-gray-700 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground", children: "Total ESSENCE in Circulation" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-3xl font-bold text-primary dark:text-primary", children: [
        totalEssence.toLocaleString(),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-xl font-medium text-muted-foreground dark:text-muted-foreground", children: "ESSENCE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Mint New ESSENCE" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleMintCurrency, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "mintAmount", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Amount to Mint" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "mintAmount",
              name: "mintAmount",
              value: mintAmount,
              onChange: (e) => setMintAmount(e.target.value),
              required: true,
              min: "0.01",
              step: "any",
              className: "input-style mt-1",
              placeholder: "e.g., 10000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "mintReason", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Reason / Description (Optional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "mintReason",
              name: "mintReason",
              value: mintReason,
              onChange: (e) => setMintReason(e.target.value),
              className: "input-style mt-1",
              placeholder: "e.g., Monthly reward pool top-up"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            className: "btn btn-primary",
            children: [
              /* @__PURE__ */ jsx(PlusCircleIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }),
              "Mint Currency"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Issuance History" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search history (reason, amount, date...)",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "input-style block w-full pl-10 pr-3 py-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("th", { scope: "col", className: "th-style", children: [
            " ",
            "Date / Time"
          ] }),
          /* @__PURE__ */ jsxs("th", { scope: "col", className: "th-style", children: [
            " ",
            "Amount Issued"
          ] }),
          /* @__PURE__ */ jsxs("th", { scope: "col", className: "th-style", children: [
            " ",
            "Reason / Description"
          ] }),
          /* @__PURE__ */ jsxs("th", { scope: "col", className: "th-style", children: [
            " ",
            "Issued By"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredHistory.length > 0 ? filteredHistory.map((record) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { className: "td-style", children: [
            " ",
            record.timestamp.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "td-style font-medium", children: [
            " ",
            record.amount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "td-style", children: [
            " ",
            record.reason
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "td-style", children: [
            " ",
            record.issuedBy
          ] })
        ] }, record.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-6 py-4 text-center text-sm text-muted-foreground dark:text-muted-foreground", children: searchTerm ? "No matching records found." : "No issuance history yet." }) }) })
      ] }) })
    ] })
  ] });
}
function BehaviorManagementTab() {
  const [actionType, setActionType] = useState("reward");
  const [targetType, setTargetType] = useState("user");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [rewardHistory, setRewardHistory] = useState([]);
  const [fineHistory, setFineHistory] = useState([]);
  const [fineAccountBalance, setFineAccountBalance] = useState(500);
  const [searchTermReward, setSearchTermReward] = useState("");
  const [searchTermFine, setSearchTermFine] = useState("");
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  const targetOptions = useMemo(() => {
    return targetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [targetType]);
  const filteredRewardHistory = useMemo(() => {
    if (!searchTermReward) return rewardHistory;
    const lowerSearch = searchTermReward.toLowerCase();
    return rewardHistory.filter(
      (r) => r.actor.toLowerCase().includes(lowerSearch) || r.target.toLowerCase().includes(lowerSearch) || r.reason.toLowerCase().includes(lowerSearch) || r.amount.toString().includes(lowerSearch) || r.timestamp.toLocaleString().toLowerCase().includes(lowerSearch)
    );
  }, [rewardHistory, searchTermReward]);
  const filteredFineHistory = useMemo(() => {
    if (!searchTermFine) return fineHistory;
    const lowerSearch = searchTermFine.toLowerCase();
    return fineHistory.filter(
      (r) => r.actor.toLowerCase().includes(lowerSearch) || r.target.toLowerCase().includes(lowerSearch) || r.reason.toLowerCase().includes(lowerSearch) || r.amount.toString().includes(lowerSearch) || r.timestamp.toLocaleString().toLowerCase().includes(lowerSearch)
    );
  }, [fineHistory, searchTermFine]);
  const handleSubmit = (event) => {
    var _a;
    event.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    if (!selectedTarget) {
      alert(`Please select a ${targetType}.`);
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    const targetName = ((_a = targetOptions.find((t) => t.id === selectedTarget)) == null ? void 0 : _a.name) || selectedTarget;
    const newRecord = {
      id: crypto.randomUUID(),
      // OK in event handler
      timestamp: /* @__PURE__ */ new Date(),
      // OK in event handler
      actor: "Current Admin",
      // Placeholder
      target: targetName,
      targetType,
      amount: numericAmount,
      reason
    };
    let successMsg = "";
    if (actionType === "reward") {
      setRewardHistory((prev) => [newRecord, ...prev]);
      successMsg = `Successfully rewarded ${targetName} with ${numericAmount.toLocaleString()} ESSENCE.`;
      console.log("Mock Reward:", newRecord);
    } else {
      setFineHistory((prev) => [newRecord, ...prev]);
      setFineAccountBalance((prev) => prev + numericAmount);
      successMsg = `Successfully fined ${targetName} ${numericAmount.toLocaleString()} ESSENCE.`;
      console.log("Mock Fine:", newRecord);
    }
    setNotificationMessage(successMsg);
    setShowNotification(true);
    setSelectedTarget("");
    setAmount("");
    setReason("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-b-md dark:border-gray-700 space-y-6 relative", children: [
    " ",
    showNotification && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed top-20 right-6 z-50 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900 dark:text-green-300 shadow-lg border border-green-300 dark:border-green-600",
        role: "alert",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(CheckCircleIcon$1, { className: "flex-shrink-0 inline w-5 h-5 mr-3" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: notificationMessage })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 shadow rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium leading-6 text-yellow-800 dark:text-yellow-300", children: "Central Fine Account Balance" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xl font-bold text-yellow-900 dark:text-yellow-200", children: [
        fineAccountBalance.toLocaleString(),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-yellow-700 dark:text-yellow-400", children: "ESSENCE" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-yellow-600 dark:text-yellow-400", children: "This balance increases when fines are issued." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-medium text-card-foreground dark:text-card-foreground mr-4", children: "Action:" }),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-md shadow-sm", role: "group", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActionType("reward"),
              className: cn(
                "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                actionType === "reward" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 z-10 ring-1 ring-green-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                "rounded-l-lg"
              ),
              children: [
                /* @__PURE__ */ jsx(ThumbsUpIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                "Reward"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActionType("fine"),
              className: cn(
                "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                actionType === "fine" ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 z-10 ring-1 ring-red-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                "rounded-r-md"
                // Adjusted for two buttons
              ),
              children: [
                /* @__PURE__ */ jsx(ThumbsDownIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                "Fine"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground dark:text-foreground mb-1", children: "Target Type" }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-md shadow-sm", role: "group", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setTargetType("user");
                  setSelectedTarget("");
                },
                className: cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                  targetType === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                  "rounded-l-lg"
                ),
                children: [
                  /* @__PURE__ */ jsx(UserIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                  "Individual User"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setTargetType("group");
                  setSelectedTarget("");
                },
                className: cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                  targetType === "group" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                  "rounded-r-md"
                ),
                children: [
                  /* @__PURE__ */ jsx(UsersIcon$1, { className: "-ml-1 mr-2 h-5 w-5" }),
                  "Group"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "targetSelector", className: "block text-sm font-medium text-foreground dark:text-foreground", children: [
            "Select ",
            targetType === "user" ? "User" : "Group"
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "targetSelector",
              name: "targetSelector",
              value: selectedTarget,
              onChange: (e) => setSelectedTarget(e.target.value),
              required: true,
              className: "input-style mt-1",
              children: [
                /* @__PURE__ */ jsxs("option", { value: "", disabled: true, children: [
                  "-- Select a ",
                  targetType,
                  " --"
                ] }),
                targetOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.name }, option.id))
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground dark:text-muted-foreground", children: "Note: This is a basic selector. A searchable dropdown will be implemented later." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "behaviorAmount", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Amount (ESSENCE)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "behaviorAmount",
              name: "behaviorAmount",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              required: true,
              min: "0.01",
              step: "any",
              className: "input-style mt-1",
              placeholder: `Amount to ${actionType}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "behaviorReason", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Reason" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "behaviorReason",
              name: "behaviorReason",
              rows: 3,
              value: reason,
              onChange: (e) => setReason(e.target.value),
              required: true,
              className: "input-style mt-1",
              placeholder: `Reason for the ${actionType}...`
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            className: cn(
              "btn",
              // Use base btn class
              actionType === "reward" ? "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white" : "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
              // Keep specific colors
            ),
            children: [
              actionType === "reward" ? /* @__PURE__ */ jsx(ThumbsUpIcon, { className: "-ml-1 mr-2 h-5 w-5" }) : /* @__PURE__ */ jsx(ThumbsDownIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
              actionType === "reward" ? "Reward" : "Fine",
              " ",
              targetType === "user" ? "User" : "Group"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Reward History" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search rewards...",
              value: searchTermReward,
              onChange: (e) => setSearchTermReward(e.target.value),
              className: "input-style block w-full pl-10 pr-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Date" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Awarder" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Recipient" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Amount" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Reason" }),
            " "
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredRewardHistory.length > 0 ? filteredRewardHistory.map((record) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "td-style text-muted-foreground", children: record.timestamp.toLocaleString() }),
            " ",
            /* @__PURE__ */ jsx("td", { className: "td-style", children: record.actor }),
            " ",
            /* @__PURE__ */ jsxs("td", { className: "td-style", children: [
              record.target,
              " (",
              record.targetType,
              ")"
            ] }),
            " ",
            /* @__PURE__ */ jsxs("td", { className: "td-style text-green-600 dark:text-green-400 font-medium", children: [
              "+",
              record.amount.toLocaleString()
            ] }),
            " ",
            /* @__PURE__ */ jsx("td", { className: "td-style text-muted-foreground max-w-xs truncate", title: record.reason, children: record.reason }),
            " "
          ] }, record.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: searchTermReward ? "No matching rewards found." : "No reward history yet." }) }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Fine History" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search fines...",
              value: searchTermFine,
              onChange: (e) => setSearchTermFine(e.target.value),
              className: "input-style block w-full pl-10 pr-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Date" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Admin" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Fined Entity" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Amount" }),
            " ",
            /* @__PURE__ */ jsx("th", { scope: "col", className: "th-style", children: "Reason" }),
            " "
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredFineHistory.length > 0 ? filteredFineHistory.map((record) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "td-style text-muted-foreground", children: record.timestamp.toLocaleString() }),
            " ",
            /* @__PURE__ */ jsx("td", { className: "td-style", children: record.actor }),
            " ",
            /* @__PURE__ */ jsxs("td", { className: "td-style", children: [
              record.target,
              " (",
              record.targetType,
              ")"
            ] }),
            " ",
            /* @__PURE__ */ jsxs("td", { className: "td-style text-red-600 dark:text-red-400 font-medium", children: [
              "-",
              record.amount.toLocaleString()
            ] }),
            " ",
            /* @__PURE__ */ jsx("td", { className: "td-style text-muted-foreground max-w-xs truncate", title: record.reason, children: record.reason }),
            " "
          ] }, record.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: searchTermFine ? "No matching fines found." : "No fine history yet." }) }) })
        ] }) })
      ] })
    ] })
  ] });
}
function EconomyManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState("addActivity");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [activities, setActivities] = useState([
    { id: "act1", name: "Daily Standup Report", description: "Submit daily progress report.", pay: 50, frequency: "Daily", slots: 10, createdDate: /* @__PURE__ */ new Date("2023-10-23T09:00:00Z"), isActive: true },
    { id: "act2", name: "Code Review", description: "Review a peer's pull request.", pay: 150, frequency: "One-time", slots: 5, createdDate: /* @__PURE__ */ new Date("2023-10-25T14:00:00Z"), isActive: true },
    { id: "act3", name: "Weekly Planning", description: "Participate in weekly team planning.", pay: 200, frequency: "Weekly", slots: 15, createdDate: /* @__PURE__ */ new Date("2023-10-21T10:00:00Z"), isActive: false }
  ]);
  const [expenses, setExpenses] = useState([
    // Add some initial mock expenses if needed for testing
    { id: "exp1", name: "Monthly Software Subscription", description: "Fee for IDE license", cost: 200, frequency: "Monthly", createdDate: /* @__PURE__ */ new Date("2023-11-01T00:00:00Z"), isActive: true },
    { id: "exp2", name: "Team Lunch Fund", description: "Contribution to weekly team lunch", cost: 50, frequency: "Weekly", createdDate: /* @__PURE__ */ new Date("2023-10-28T12:00:00Z"), isActive: true },
    { id: "exp3", name: "Coffee Machine Maintenance", description: "Monthly upkeep", cost: 75, frequency: "Monthly", createdDate: /* @__PURE__ */ new Date("2023-10-15T08:00:00Z"), isActive: false }
  ]);
  const [activityAssignments, setActivityAssignments] = useState([
    // Add mock assignment for testing table
    { id: "assignAct1", targetId: "user1", targetName: "Alice", targetType: "user", activityId: "act1", activityName: "Daily Standup Report", assignedDate: /* @__PURE__ */ new Date("2023-11-05T10:00:00Z"), assignedBy: "Admin B" },
    { id: "assignAct2", targetId: "groupA", targetName: "Developers", targetType: "group", activityId: "act2", activityName: "Code Review", assignedDate: /* @__PURE__ */ new Date("2023-11-06T11:00:00Z"), assignedBy: "Admin B" }
  ]);
  const [expenseAssignments, setExpenseAssignments] = useState([
    // Add mock expense assignment for testing
    { id: "assignExp1", targetId: "user2", targetName: "Bob", targetType: "user", expenseId: "exp1", expenseName: "Monthly Software Subscription", assignedDate: /* @__PURE__ */ new Date("2023-11-02T09:30:00Z"), assignedBy: "Admin A" },
    { id: "assignExp2", targetId: "groupA", targetName: "Developers", targetType: "group", expenseId: "exp2", expenseName: "Team Lunch Fund", assignedDate: /* @__PURE__ */ new Date("2023-11-03T13:00:00Z"), assignedBy: "Admin A" }
  ]);
  const [activityName, setActivityName] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [activityPay, setActivityPay] = useState("");
  const [activityFreq, setActivityFreq] = useState("One-time");
  const [activitySlots, setActivitySlots] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCost, setExpenseCost] = useState("");
  const [expenseFreq, setExpenseFreq] = useState("One-time");
  const [assignActivityTargetType, setAssignActivityTargetType] = useState("user");
  const [selectedAssignActivityTarget, setSelectedAssignActivityTarget] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [assignExpenseTargetType, setAssignExpenseTargetType] = useState("user");
  const [selectedAssignExpenseTarget, setSelectedAssignExpenseTarget] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [expenseSearchTerm, setExpenseSearchTerm] = useState("");
  const [activityAssignmentSearchTerm, setActivityAssignmentSearchTerm] = useState("");
  const [expenseAssignmentSearchTerm, setExpenseAssignmentSearchTerm] = useState("");
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  const handleShowNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };
  const handleAddActivity = (event) => {
    event.preventDefault();
    const pay = parseFloat(activityPay);
    const slots = parseInt(activitySlots, 10);
    if (!activityName.trim() || !activityDesc.trim()) {
      alert("Please fill in Activity Name and Description.");
      return;
    }
    if (isNaN(pay) || pay <= 0) {
      alert("Please enter a valid positive Pay amount.");
      return;
    }
    if (isNaN(slots) || slots <= 0) {
      alert("Please enter a valid positive number for Slots Available.");
      return;
    }
    const newActivity = {
      id: crypto.randomUUID(),
      // OK in event handler
      name: activityName.trim(),
      description: activityDesc.trim(),
      pay,
      frequency: activityFreq,
      slots,
      createdDate: /* @__PURE__ */ new Date(),
      // OK in event handler
      isActive: true
      // Default to active
    };
    setActivities((prev) => [newActivity, ...prev]);
    handleShowNotification(`Activity '${newActivity.name}' created successfully.`);
    console.log(`[Admin Action] Activity Created: ${newActivity.name} by Current Admin`);
    setActivityName("");
    setActivityDesc("");
    setActivityPay("");
    setActivityFreq("One-time");
    setActivitySlots("");
  };
  const handleEditActivity = (id) => console.log("Edit Activity:", id);
  const handleDeleteActivity = (id) => {
    const activityToDelete = activities.find((act) => act.id === id);
    if (!activityToDelete) return;
    if (window.confirm(`Are you sure you want to delete the activity '${activityToDelete.name}'? This cannot be undone.`)) {
      setActivities((prev) => prev.filter((act) => act.id !== id));
      setActivityAssignments((prev) => prev.filter((assign) => assign.activityId !== id));
      handleShowNotification(`Activity '${activityToDelete.name}' deleted and unassigned.`);
      console.log(`[Admin Action] Activity Deleted: ${activityToDelete.name} (ID: ${id}) by Current Admin`);
    }
  };
  const handleToggleActivityStatus = (id) => {
    let activityName2 = "";
    let newStatus = false;
    setActivities(
      (prev) => prev.map((act) => {
        if (act.id === id) {
          activityName2 = act.name;
          newStatus = !act.isActive;
          return { ...act, isActive: newStatus };
        }
        return act;
      })
    );
    handleShowNotification(`Activity '${activityName2}' status updated to ${newStatus ? "Active" : "Inactive"}.`);
    console.log(`[Admin Action] Activity Status Toggled: ${activityName2} (ID: ${id}) to ${newStatus ? "Active" : "Inactive"} by Current Admin`);
  };
  const handleAddExpense = (event) => {
    event.preventDefault();
    const cost = parseFloat(expenseCost);
    if (!expenseName.trim() || !expenseDesc.trim()) {
      alert("Please fill in Expense Name and Description.");
      return;
    }
    if (isNaN(cost) || cost <= 0) {
      alert("Please enter a valid positive Cost amount.");
      return;
    }
    const newExpense = {
      id: crypto.randomUUID(),
      // OK in event handler
      name: expenseName.trim(),
      description: expenseDesc.trim(),
      cost,
      frequency: expenseFreq,
      createdDate: /* @__PURE__ */ new Date(),
      // OK in event handler
      isActive: true
      // Default to active
    };
    setExpenses((prev) => [newExpense, ...prev]);
    handleShowNotification(`Expense '${newExpense.name}' added successfully.`);
    console.log(`[Admin Action] Expense Created: ${newExpense.name} by Current Admin`);
    setExpenseName("");
    setExpenseDesc("");
    setExpenseCost("");
    setExpenseFreq("One-time");
  };
  const handleEditExpense = (id) => console.log("Edit Expense:", id);
  const handleDeleteExpense = (id) => {
    const expenseToDelete = expenses.find((exp) => exp.id === id);
    if (!expenseToDelete) return;
    if (window.confirm(`Are you sure you want to delete the expense '${expenseToDelete.name}'? This cannot be undone.`)) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      setExpenseAssignments((prev) => prev.filter((assign) => assign.expenseId !== id));
      handleShowNotification(`Expense '${expenseToDelete.name}' deleted and unassigned.`);
      console.log(`[Admin Action] Expense Deleted: ${expenseToDelete.name} (ID: ${id}) by Current Admin`);
    }
  };
  const handleToggleExpenseStatus = (id) => {
    let expenseName2 = "";
    let newStatus = false;
    setExpenses(
      (prev) => prev.map((exp) => {
        if (exp.id === id) {
          expenseName2 = exp.name;
          newStatus = !exp.isActive;
          return { ...exp, isActive: newStatus };
        }
        return exp;
      })
    );
    handleShowNotification(`Expense '${expenseName2}' status updated to ${newStatus ? "Active" : "Inactive"}.`);
    console.log(`[Admin Action] Expense Status Toggled: ${expenseName2} (ID: ${id}) to ${newStatus ? "Active" : "Inactive"} by Current Admin`);
  };
  const handleAssignActivity = (event) => {
    event.preventDefault();
    if (!selectedAssignActivityTarget) {
      alert(`Please select a ${assignActivityTargetType}.`);
      return;
    }
    if (!selectedActivityId) {
      alert("Please select an activity to assign.");
      return;
    }
    const targetList = assignActivityTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
    const target = targetList.find((t) => t.id === selectedAssignActivityTarget);
    const activity = activities.find((a) => a.id === selectedActivityId);
    if (!target || !activity) {
      alert("Selected target or activity not found.");
      return;
    }
    const alreadyAssigned = activityAssignments.some(
      (assign) => assign.targetId === target.id && assign.activityId === activity.id
    );
    if (alreadyAssigned) {
      alert(`${activity.name} is already assigned to ${target.name}.`);
      return;
    }
    const newAssignment = {
      id: crypto.randomUUID(),
      // OK in event handler
      targetId: target.id,
      targetName: target.name,
      targetType: assignActivityTargetType,
      activityId: activity.id,
      activityName: activity.name,
      assignedDate: /* @__PURE__ */ new Date(),
      // OK in event handler
      assignedBy: "Current Admin"
      // Placeholder
    };
    setActivityAssignments((prev) => [newAssignment, ...prev]);
    handleShowNotification(`Activity '${activity.name}' assigned to ${target.name}.`);
    console.log(`[Admin Action] Activity Assigned: '${activity.name}' to ${target.name} (${assignActivityTargetType}) by Current Admin`);
    setSelectedAssignActivityTarget("");
    setSelectedActivityId("");
  };
  const handleUnassignActivity = (assignmentId) => {
    const assignment = activityAssignments.find((a) => a.id === assignmentId);
    if (!assignment) return;
    if (window.confirm(`Are you sure you want to unassign '${assignment.activityName}' from '${assignment.targetName}'?`)) {
      setActivityAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      handleShowNotification("Activity unassigned successfully.");
      console.log(`[Admin Action] Activity Unassigned: '${assignment.activityName}' from ${assignment.targetName} (ID: ${assignmentId}) by Current Admin`);
    }
  };
  const handleAssignExpense = (event) => {
    event.preventDefault();
    if (!selectedAssignExpenseTarget) {
      alert(`Please select a ${assignExpenseTargetType}.`);
      return;
    }
    if (!selectedExpenseId) {
      alert("Please select an expense to assign.");
      return;
    }
    const targetList = assignExpenseTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
    const target = targetList.find((t) => t.id === selectedAssignExpenseTarget);
    const expense = expenses.find((e) => e.id === selectedExpenseId);
    if (!target || !expense) {
      alert("Selected target or expense not found.");
      return;
    }
    const alreadyAssigned = expenseAssignments.some(
      (assign) => assign.targetId === target.id && assign.expenseId === expense.id
    );
    if (alreadyAssigned) {
      alert(`${expense.name} is already assigned to ${target.name}.`);
      return;
    }
    const newAssignment = {
      id: crypto.randomUUID(),
      // OK in event handler
      targetId: target.id,
      targetName: target.name,
      targetType: assignExpenseTargetType,
      expenseId: expense.id,
      expenseName: expense.name,
      assignedDate: /* @__PURE__ */ new Date(),
      // OK in event handler
      assignedBy: "Current Admin"
      // Placeholder
    };
    setExpenseAssignments((prev) => [newAssignment, ...prev]);
    handleShowNotification(`Expense '${expense.name}' assigned to ${target.name}.`);
    console.log(`[Admin Action] Expense Assigned: '${expense.name}' to ${target.name} (${assignExpenseTargetType}) by Current Admin`);
    setSelectedAssignExpenseTarget("");
    setSelectedExpenseId("");
  };
  const handleUnassignExpense = (assignmentId) => {
    const assignment = expenseAssignments.find((a) => a.id === assignmentId);
    if (!assignment) return;
    if (window.confirm(`Are you sure you want to unassign '${assignment.expenseName}' from '${assignment.targetName}'?`)) {
      setExpenseAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      handleShowNotification("Expense unassigned successfully.");
      console.log(`[Admin Action] Expense Unassigned: '${assignment.expenseName}' from ${assignment.targetName} (ID: ${assignmentId}) by Current Admin`);
    }
  };
  const filteredActivities = useMemo(() => {
    if (!activitySearchTerm) return activities;
    const lowerSearch = activitySearchTerm.toLowerCase();
    return activities.filter(
      (act) => act.name.toLowerCase().includes(lowerSearch) || act.description.toLowerCase().includes(lowerSearch) || act.pay.toString().includes(lowerSearch) || act.frequency.toLowerCase().includes(lowerSearch) || act.slots.toString().includes(lowerSearch) || act.createdDate.toLocaleDateString().includes(lowerSearch)
    );
  }, [activities, activitySearchTerm]);
  const filteredExpenses = useMemo(() => {
    if (!expenseSearchTerm) return expenses;
    const lowerSearch = expenseSearchTerm.toLowerCase();
    return expenses.filter(
      (exp) => exp.name.toLowerCase().includes(lowerSearch) || exp.description.toLowerCase().includes(lowerSearch) || exp.cost.toString().includes(lowerSearch) || exp.frequency.toLowerCase().includes(lowerSearch) || exp.createdDate.toLocaleDateString().includes(lowerSearch)
    );
  }, [expenses, expenseSearchTerm]);
  const assignActivityTargetOptions = useMemo(() => {
    return assignActivityTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [assignActivityTargetType]);
  const activeActivities = useMemo(() => {
    return activities.filter((act) => act.isActive);
  }, [activities]);
  const filteredActivityAssignments = useMemo(() => {
    if (!activityAssignmentSearchTerm) return activityAssignments;
    const lowerSearch = activityAssignmentSearchTerm.toLowerCase();
    return activityAssignments.filter(
      (assign) => assign.targetName.toLowerCase().includes(lowerSearch) || assign.activityName.toLowerCase().includes(lowerSearch) || assign.assignedBy.toLowerCase().includes(lowerSearch) || assign.assignedDate.toLocaleString().toLowerCase().includes(lowerSearch) || assign.targetType.toLowerCase().includes(lowerSearch)
    );
  }, [activityAssignments, activityAssignmentSearchTerm]);
  const assignExpenseTargetOptions = useMemo(() => {
    return assignExpenseTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [assignExpenseTargetType]);
  const activeExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.isActive);
  }, [expenses]);
  const filteredExpenseAssignments = useMemo(() => {
    if (!expenseAssignmentSearchTerm) return expenseAssignments;
    const lowerSearch = expenseAssignmentSearchTerm.toLowerCase();
    return expenseAssignments.filter(
      (assign) => assign.targetName.toLowerCase().includes(lowerSearch) || assign.expenseName.toLowerCase().includes(lowerSearch) || assign.assignedBy.toLowerCase().includes(lowerSearch) || assign.assignedDate.toLocaleString().toLowerCase().includes(lowerSearch) || assign.targetType.toLowerCase().includes(lowerSearch)
    );
  }, [expenseAssignments, expenseAssignmentSearchTerm]);
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "addActivity":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Create New Activity" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleAddActivity, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "activityName", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Activity Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", id: "activityName", value: activityName, onChange: (e) => setActivityName(e.target.value), required: true, className: "mt-1 block w-full input-style" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "activityDesc", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Description" }),
                /* @__PURE__ */ jsx("textarea", { id: "activityDesc", value: activityDesc, onChange: (e) => setActivityDesc(e.target.value), required: true, rows: 3, className: "mt-1 block w-full input-style" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "activityPay", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Pay (ESSENCE)" }),
                  /* @__PURE__ */ jsx("input", { type: "number", id: "activityPay", value: activityPay, onChange: (e) => setActivityPay(e.target.value), required: true, min: "0.01", step: "any", className: "mt-1 block w-full input-style" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "activityFreq", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Payment Frequency" }),
                  /* @__PURE__ */ jsxs("select", { id: "activityFreq", value: activityFreq, onChange: (e) => setActivityFreq(e.target.value), required: true, className: "mt-1 block w-full input-style", children: [
                    /* @__PURE__ */ jsx("option", { value: "One-time", children: "One-time" }),
                    /* @__PURE__ */ jsx("option", { value: "Daily", children: "Daily" }),
                    /* @__PURE__ */ jsx("option", { value: "Weekly", children: "Weekly" }),
                    /* @__PURE__ */ jsx("option", { value: "Monthly", children: "Monthly" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "activitySlots", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Slots Available" }),
                  /* @__PURE__ */ jsx("input", { type: "number", id: "activitySlots", value: activitySlots, onChange: (e) => setActivitySlots(e.target.value), required: true, min: "1", step: "1", className: "mt-1 block w-full input-style" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", children: [
                /* @__PURE__ */ jsx(PlusCircleIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                " Add Activity"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Existing Activities" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search activities...",
                  value: activitySearchTerm,
                  onChange: (e) => setActivitySearchTerm(e.target.value),
                  className: "input-style block w-full pl-10 pr-3 py-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Description" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-right", children: "Pay" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Frequency" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Slots" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Created" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredActivities.length > 0 ? filteredActivities.map((act) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "td-style font-medium", children: act.name }),
                /* @__PURE__ */ jsx("td", { className: "td-style max-w-sm truncate", title: act.description, children: act.description }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-right", children: act.pay.toLocaleString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: act.frequency }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: act.slots }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: act.createdDate.toLocaleDateString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsx("span", { className: cn(
                  "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                  act.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                ), children: act.isActive ? "Active" : "Inactive" }) }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => handleEditActivity(act.id), className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300", title: "Edit", children: /* @__PURE__ */ jsx(EditIcon$2, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleToggleActivityStatus(act.id), className: cn("hover:text-opacity-80", act.isActive ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"), title: act.isActive ? "Deactivate" : "Activate", children: act.isActive ? /* @__PURE__ */ jsx(ToggleLeftIcon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ToggleRightIcon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteActivity(act.id), className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300", title: "Delete", children: /* @__PURE__ */ jsx(Trash2Icon, { className: "h-4 w-4" }) })
                ] }) })
              ] }, act.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: activitySearchTerm ? "No matching activities found." : "No activities created yet." }) }) })
            ] }) })
          ] })
        ] });
      case "addExpense":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Define New Expense" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleAddExpense, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "expenseName", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Expense Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", id: "expenseName", value: expenseName, onChange: (e) => setExpenseName(e.target.value), required: true, className: "mt-1 block w-full input-style" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "expenseDesc", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Description" }),
                /* @__PURE__ */ jsx("textarea", { id: "expenseDesc", value: expenseDesc, onChange: (e) => setExpenseDesc(e.target.value), required: true, rows: 3, className: "mt-1 block w-full input-style" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "expenseCost", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Cost (ESSENCE)" }),
                  /* @__PURE__ */ jsx("input", { type: "number", id: "expenseCost", value: expenseCost, onChange: (e) => setExpenseCost(e.target.value), required: true, min: "0.01", step: "any", className: "mt-1 block w-full input-style" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "expenseFreq", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Expense Frequency" }),
                  /* @__PURE__ */ jsxs("select", { id: "expenseFreq", value: expenseFreq, onChange: (e) => setExpenseFreq(e.target.value), required: true, className: "mt-1 block w-full input-style", children: [
                    /* @__PURE__ */ jsx("option", { value: "One-time", children: "One-time" }),
                    /* @__PURE__ */ jsx("option", { value: "Daily", children: "Daily" }),
                    /* @__PURE__ */ jsx("option", { value: "Weekly", children: "Weekly" }),
                    /* @__PURE__ */ jsx("option", { value: "Monthly", children: "Monthly" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", children: [
                /* @__PURE__ */ jsx(PlusCircleIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                " Add Expense"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Existing Expenses" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search expenses...",
                  value: expenseSearchTerm,
                  onChange: (e) => setExpenseSearchTerm(e.target.value),
                  className: "input-style block w-full pl-10 pr-3 py-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Description" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-right", children: "Cost" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Frequency" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Created" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredExpenses.length > 0 ? filteredExpenses.map((exp) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "td-style font-medium", children: exp.name }),
                /* @__PURE__ */ jsx("td", { className: "td-style max-w-sm truncate", title: exp.description, children: exp.description }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-right text-red-600 dark:text-red-400", children: exp.cost.toLocaleString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: exp.frequency }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: exp.createdDate.toLocaleDateString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsx("span", { className: cn(
                  "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                  exp.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                ), children: exp.isActive ? "Active" : "Inactive" }) }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => handleEditExpense(exp.id), className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300", title: "Edit", children: /* @__PURE__ */ jsx(EditIcon$2, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleToggleExpenseStatus(exp.id), className: cn("hover:text-opacity-80", exp.isActive ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"), title: exp.isActive ? "Deactivate" : "Activate", children: exp.isActive ? /* @__PURE__ */ jsx(ToggleLeftIcon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ToggleRightIcon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteExpense(exp.id), className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300", title: "Delete", children: /* @__PURE__ */ jsx(Trash2Icon, { className: "h-4 w-4" }) })
                ] }) })
              ] }, exp.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: expenseSearchTerm ? "No matching expenses found." : "No expenses defined yet." }) }) })
            ] }) })
          ] })
        ] });
      case "assignActivity":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Assign Activity" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleAssignActivity, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground dark:text-foreground mb-1", children: "Assign To" }),
                /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-md shadow-sm", role: "group", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAssignActivityTargetType("user");
                        setSelectedAssignActivityTarget("");
                      },
                      className: cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignActivityTargetType === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-l-lg"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(UserIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                        "Individual User"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAssignActivityTargetType("group");
                        setSelectedAssignActivityTarget("");
                      },
                      className: cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignActivityTargetType === "group" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-r-md"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(UsersIcon$1, { className: "-ml-1 mr-2 h-5 w-5" }),
                        "Group"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "assignActivityTargetSelector", className: "block text-sm font-medium text-foreground dark:text-foreground", children: [
                  "Select ",
                  assignActivityTargetType === "user" ? "User" : "Group"
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "assignActivityTargetSelector",
                    name: "assignActivityTargetSelector",
                    value: selectedAssignActivityTarget,
                    onChange: (e) => setSelectedAssignActivityTarget(e.target.value),
                    required: true,
                    className: "input-style mt-1",
                    children: [
                      /* @__PURE__ */ jsxs("option", { value: "", disabled: true, children: [
                        "-- Select a ",
                        assignActivityTargetType,
                        " --"
                      ] }),
                      assignActivityTargetOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.name }, option.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground dark:text-muted-foreground", children: "Note: This is a basic selector. A searchable dropdown will be implemented later." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "assignActivitySelector", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Select Activity" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "assignActivitySelector",
                    name: "assignActivitySelector",
                    value: selectedActivityId,
                    onChange: (e) => setSelectedActivityId(e.target.value),
                    required: true,
                    className: "input-style mt-1",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "-- Select an active activity --" }),
                      activeActivities.length > 0 ? activeActivities.map((activity) => /* @__PURE__ */ jsxs("option", { value: activity.id, children: [
                        activity.name,
                        " (Pay: ",
                        activity.pay,
                        ", Freq: ",
                        activity.frequency,
                        ")"
                      ] }, activity.id)) : /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "No active activities available" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", children: [
                /* @__PURE__ */ jsx(LinkIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                " Assign Activity"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Current Activity Assignments" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search assignments (user, group, activity...)",
                  value: activityAssignmentSearchTerm,
                  onChange: (e) => setActivityAssignmentSearchTerm(e.target.value),
                  className: "input-style block w-full pl-10 pr-3 py-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "User/Group Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Activity Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Assigned Date" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Assigned By" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredActivityAssignments.length > 0 ? filteredActivityAssignments.map((assign) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsxs("td", { className: "td-style font-medium", children: [
                  assign.targetName,
                  " (",
                  assign.targetType,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.activityName }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.assignedDate.toLocaleString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.assignedBy }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleUnassignActivity(assign.id),
                    className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
                    title: "Unassign",
                    children: [
                      /* @__PURE__ */ jsx(XCircleIcon, { className: "h-4 w-4 mr-1" }),
                      " Unassign"
                    ]
                  }
                ) })
              ] }, assign.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: activityAssignmentSearchTerm ? "No matching assignments found." : "No activities assigned yet." }) }) })
            ] }) })
          ] })
        ] });
      case "assignExpense":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Assign Expense" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleAssignExpense, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground dark:text-foreground mb-1", children: "Assign To" }),
                /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-md shadow-sm", role: "group", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAssignExpenseTargetType("user");
                        setSelectedAssignExpenseTarget("");
                      },
                      className: cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignExpenseTargetType === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-l-lg"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(UserIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                        "Individual User"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setAssignExpenseTargetType("group");
                        setSelectedAssignExpenseTarget("");
                      },
                      className: cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignExpenseTargetType === "group" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500" : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-r-md"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(UsersIcon$1, { className: "-ml-1 mr-2 h-5 w-5" }),
                        "Group"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "assignExpenseTargetSelector", className: "block text-sm font-medium text-foreground dark:text-foreground", children: [
                  "Select ",
                  assignExpenseTargetType === "user" ? "User" : "Group"
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "assignExpenseTargetSelector",
                    name: "assignExpenseTargetSelector",
                    value: selectedAssignExpenseTarget,
                    onChange: (e) => setSelectedAssignExpenseTarget(e.target.value),
                    required: true,
                    className: "input-style mt-1",
                    children: [
                      /* @__PURE__ */ jsxs("option", { value: "", disabled: true, children: [
                        "-- Select a ",
                        assignExpenseTargetType,
                        " --"
                      ] }),
                      assignExpenseTargetOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.name }, option.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground dark:text-muted-foreground", children: "Note: This is a basic selector. A searchable dropdown will be implemented later." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "assignExpenseSelector", className: "block text-sm font-medium text-foreground dark:text-foreground", children: "Select Expense" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "assignExpenseSelector",
                    name: "assignExpenseSelector",
                    value: selectedExpenseId,
                    onChange: (e) => setSelectedExpenseId(e.target.value),
                    required: true,
                    className: "input-style mt-1",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "-- Select an active expense --" }),
                      activeExpenses.length > 0 ? activeExpenses.map((expense) => /* @__PURE__ */ jsxs("option", { value: expense.id, children: [
                        expense.name,
                        " (Cost: ",
                        expense.cost,
                        ", Freq: ",
                        expense.frequency,
                        ")"
                      ] }, expense.id)) : /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "No active expenses available" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn btn-primary", children: [
                /* @__PURE__ */ jsx(LinkIcon, { className: "-ml-1 mr-2 h-5 w-5" }),
                " Assign Expense"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card dark:bg-card shadow rounded-lg p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4", children: "Current Expense Assignments" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$2, { className: "h-5 w-5 text-muted-foreground", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search assignments (user, group, expense...)",
                  value: expenseAssignmentSearchTerm,
                  onChange: (e) => setExpenseAssignmentSearchTerm(e.target.value),
                  className: "input-style block w-full pl-10 pr-3 py-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border dark:divide-border", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "User/Group Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Expense Name" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Assigned Date" }),
                /* @__PURE__ */ jsx("th", { className: "th-style", children: "Assigned By" }),
                /* @__PURE__ */ jsx("th", { className: "th-style text-center", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "bg-card dark:bg-card divide-y divide-border dark:divide-border", children: filteredExpenseAssignments.length > 0 ? filteredExpenseAssignments.map((assign) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsxs("td", { className: "td-style font-medium", children: [
                  assign.targetName,
                  " (",
                  assign.targetType,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.expenseName }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.assignedDate.toLocaleString() }),
                /* @__PURE__ */ jsx("td", { className: "td-style", children: assign.assignedBy }),
                /* @__PURE__ */ jsx("td", { className: "td-style text-center", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleUnassignExpense(assign.id),
                    className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
                    title: "Unassign",
                    children: [
                      /* @__PURE__ */ jsx(XCircleIcon, { className: "h-4 w-4 mr-1" }),
                      " Unassign"
                    ]
                  }
                ) })
              ] }, assign.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-muted-foreground", children: expenseAssignmentSearchTerm ? "No matching assignments found." : "No expenses assigned yet." }) }) })
            ] }) })
          ] })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-b-md dark:border-gray-700 space-y-6 relative", children: [
    showNotification && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed top-20 right-6 z-50 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900 dark:text-green-300 shadow-lg border border-green-300 dark:border-green-600",
        role: "alert",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(CheckCircleIcon$1, { className: "flex-shrink-0 inline w-5 h-5 mr-3" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: notificationMessage })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "border-b border-border dark:border-border", children: /* @__PURE__ */ jsxs("nav", { className: "-mb-px flex space-x-6 overflow-x-auto", "aria-label": "Tabs", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveSubTab("addActivity"),
          className: cn(
            "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
            activeSubTab === "addActivity" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: "Add Activity"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveSubTab("addExpense"),
          className: cn(
            "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
            activeSubTab === "addExpense" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: "Add Expense"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveSubTab("assignActivity"),
          className: cn(
            "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
            activeSubTab === "assignActivity" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: "Assign Activity"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveSubTab("assignExpense"),
          className: cn(
            "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
            activeSubTab === "assignExpense" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: "Assign Expense"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: renderSubTabContent() })
  ] });
}
function Management() {
  const [activeTab, setActiveTab] = useState("currency");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const renderContent = () => {
    if (!isClient) {
      return null;
    }
    switch (activeTab) {
      case "currency":
        return /* @__PURE__ */ jsx(CurrencyManagementTab, {});
      case "behavior":
        return /* @__PURE__ */ jsx(BehaviorManagementTab, {});
      case "economy":
        return /* @__PURE__ */ jsx(EconomyManagementTab, {});
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4 md:p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-6", children: "Management Console" }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-border dark:border-border", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("currency"),
          className: cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "currency" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: [
            /* @__PURE__ */ jsx(CurrencyIcon, { className: "h-5 w-5" }),
            "Currency"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("behavior"),
          className: cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "behavior" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: [
            /* @__PURE__ */ jsx(BehaviorIcon, { className: "h-5 w-5" }),
            "Behavior"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("economy"),
          className: cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "economy" ? "border-primary text-primary dark:border-primary dark:text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          ),
          children: [
            /* @__PURE__ */ jsx(EconomyIcon, { className: "h-5 w-5" }),
            "Economy"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-0", children: [
      " ",
      renderContent()
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Management,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  return [
    { title: "Life Economy - Account Settings" },
    { name: "description", content: "Manage your account settings." }
  ];
};
function AccountSettings() {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl space-y-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Account Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-1 text-xl font-semibold", children: "Profile Information" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500 dark:text-gray-400", children: "Manage your account details and preferences" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "Username" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "johndoe" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "User ID" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "user123" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "Name" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "John Doe" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "Email" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "john.doe@example.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "Member Since" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "1/12/2025" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400", children: "Notifications" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Enabled" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950", children: "Edit Profile" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-1 text-xl font-semibold", children: "Security" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500 dark:text-gray-400", children: "Manage your password and security settings" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Password" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Your password was last changed on 3/28/2025" }),
          /* @__PURE__ */ jsx("button", { className: "mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400", children: "Change password" })
        ] }),
        /* @__PURE__ */ jsx("hr", { className: "dark:border-gray-700" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Two-Factor Authentication" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Add an extra layer of security to your account" }),
          /* @__PURE__ */ jsx("button", { className: "mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400", children: "Enable two-factor authentication" })
        ] })
      ] })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AccountSettings,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => {
  return [
    { title: "Life Economy - Transfer ESSENCE" },
    { name: "description", content: "Transfer ESSENCE to other users" }
  ];
};
const generateUsers = () => {
  const names = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Riley", "Jordan", "Quinn"];
  const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `user${i + 1e3}`,
    name: `${names[i % names.length]} ${surnames[i % surnames.length]}`,
    balance: Math.floor(Math.random() * 1e4) + 500,
    avatar: `https://i.pravatar.cc/150?img=${i + 10}`
  }));
};
async function action({ request }) {
  const formData = await request.formData();
  const amount = Number(formData.get("amount"));
  const recipientId = formData.get("recipient");
  const note = formData.get("note");
  if (!amount || amount <= 0) {
    return json({ error: "Please enter a valid amount" }, { status: 400 });
  }
  if (!recipientId) {
    return json({ error: "Please select a recipient" }, { status: 400 });
  }
  const users = generateUsers();
  const recipient = users.find((u) => u.id === recipientId);
  return json({
    success: true,
    message: `Successfully transferred ${amount} ESSENCE to ${(recipient == null ? void 0 : recipient.name) || recipientId}`,
    transaction: {
      id: `tx${Date.now()}`,
      amount,
      recipientId,
      recipientName: (recipient == null ? void 0 : recipient.name) || recipientId,
      note,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
}
function Transfer() {
  const [users, setUsers] = useState(generateUsers());
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [formKey, setFormKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter(
      (user) => user.name.toLowerCase().includes(lowerCaseSearchTerm) || user.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [users, searchTerm]);
  useEffect(() => {
    if (actionData == null ? void 0 : actionData.success) {
      setRecentTransfers((prev) => [
        {
          id: actionData.transaction.id,
          amount: actionData.transaction.amount,
          recipientId: actionData.transaction.recipientId,
          recipientName: actionData.transaction.recipientName,
          note: actionData.transaction.note,
          timestamp: actionData.transaction.timestamp
        },
        ...prev.slice(0, 2)
        // Keep only the 3 most recent
      ]);
      setFormKey((prev) => prev + 1);
      setSelectedUser(null);
      setSelectedUserId("");
      setSearchTerm("");
    }
  }, [actionData]);
  const handleRecipientChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl space-y-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Transfer ESSENCE" }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
      (actionData == null ? void 0 : actionData.success) ? /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-50", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: actionData.message }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm", children: [
          "Transaction ID: ",
          actionData.transaction.id
        ] })
      ] }) : (actionData == null ? void 0 : actionData.error) ? /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-50", children: /* @__PURE__ */ jsx("p", { className: "font-medium", children: actionData.error }) }) : null,
      /* @__PURE__ */ jsxs(Form, { method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "search-recipient", className: "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100", children: "Search Recipient" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "search-recipient",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Search by name or ID...",
              className: "mb-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            }
          ),
          /* @__PURE__ */ jsxs("label", { htmlFor: "recipient", className: "sr-only", children: [
            " ",
            "Select Recipient"
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "recipient",
              name: "recipient",
              value: selectedUserId,
              className: "block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              onChange: handleRecipientChange,
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: !!selectedUserId, children: "Select a user" }),
                " ",
                filteredUsers.map((user) => /* @__PURE__ */ jsxs("option", { value: user.id, className: "text-gray-900 dark:text-white", children: [
                  " ",
                  user.name,
                  " (",
                  user.id,
                  ")"
                ] }, user.id)),
                filteredUsers.length === 0 && searchTerm && /* @__PURE__ */ jsx("option", { value: "", disabled: true, className: "text-gray-500 dark:text-gray-400", children: "No users found" })
              ]
            }
          )
        ] }),
        selectedUser && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-md border p-4 dark:border-gray-700", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: selectedUser.avatar,
              alt: selectedUser.name,
              className: "h-12 w-12 rounded-full"
            }
          ),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100", children: selectedUser.name }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "amount", className: "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100", children: "Amount (ESSENCE)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "amount",
              name: "amount",
              min: "1",
              step: "1",
              className: "block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              placeholder: "Enter amount",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "note", className: "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100", children: "Note (Optional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "note",
              name: "note",
              rows: 3,
              className: "block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              placeholder: "Add a note about this transfer"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting || !selectedUserId,
            className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-950",
            children: isSubmitting ? "Processing..." : "Transfer ESSENCE"
          }
        ) })
      ] }, formKey)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Recent Transfers" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: recentTransfers.length > 0 ? recentTransfers.map((transfer) => {
        const user = users.find((u) => u.id === transfer.recipientId) || {
          name: transfer.recipientName || `User ${transfer.recipientId}`,
          avatar: `https://i.pravatar.cc/150?u=${transfer.recipientId}`
          // Use ID for consistent placeholder avatar
        };
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border p-4 dark:border-gray-700", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: user.avatar,
                alt: "Recipient",
                className: "h-10 w-10 rounded-full"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100", children: user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: new Date(transfer.timestamp).toLocaleString() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-medium text-green-600 dark:text-green-400", children: [
              "-",
              transfer.amount,
              " ESSENCE"
            ] }),
            transfer.note && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: transfer.note })
          ] })
        ] }, transfer.id);
      }) : (
        // Placeholder content if no recent transfers
        /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500 dark:text-gray-400", children: "No recent transfers to display." })
      ) })
    ] })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Transfer,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "Life Economy - Dashboard" },
    { name: "description", content: "Welcome to Life Economy!" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-6 text-3xl font-bold", children: "Dashboard" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Welcome to your Life Economy dashboard." }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Overview" }),
      /* @__PURE__ */ jsx("p", { children: "Your dashboard content will appear here." }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4", children: [
        "Navigate using the header links. Let's start with",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/settings", className: "text-blue-600 hover:underline dark:text-blue-400", children: "Account Settings" }),
        "."
      ] })
    ] })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function AlertTriangleIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
        /* @__PURE__ */ jsx("path", { d: "M12 9v4" }),
        /* @__PURE__ */ jsx("path", { d: "M12 17h.01" })
      ]
    }
  );
}
function AccessDenied({ requiredRole = "Super Admin" }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6", children: [
    /* @__PURE__ */ jsx(AlertTriangleIcon, { className: "w-16 h-16 text-destructive dark:text-destructive-foreground mb-4" }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-destructive dark:text-destructive-foreground mb-2", children: "Access Denied" }),
    /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground dark:text-muted-foreground mb-6", children: [
      "You do not have the required permissions (",
      requiredRole,
      ") to view this page."
    ] }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "btn btn-secondary",
        children: "Go to Homepage"
      }
    )
  ] });
}
function ViewIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] });
}
function EditIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
    /* @__PURE__ */ jsx("path", { d: "m15 5 4 4" })
  ] });
}
function DeleteIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
    /* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    /* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    /* @__PURE__ */ jsx("line", { x1: "10", x2: "10", y1: "11", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "14", x2: "14", y1: "11", y2: "17" })
  ] });
}
function SuspendIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("line", { x1: "10", x2: "10", y1: "15", y2: "9" }),
    /* @__PURE__ */ jsx("line", { x1: "14", x2: "14", y1: "15", y2: "9" })
  ] });
}
function RestoreIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("polygon", { points: "10 8 16 12 10 16 10 8" })
  ] });
}
function PasswordIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "16.5", cy: "7.5", r: ".5" })
  ] });
}
function UsersTable({
  users,
  onViewProfile,
  onEdit,
  onDelete,
  onSuspend,
  onRestore,
  onChangePassword
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  const getRoleClass = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "User":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
    /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Full Name" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Email" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Group" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Role" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Status" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: users.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400", children: "No users found matching your criteria." }) }) : users.map((user) => /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white", children: user.fullName }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: user.email }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: user.groupName }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: /* @__PURE__ */ jsx("span", { className: cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getRoleClass(user.role)), children: user.role }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: /* @__PURE__ */ jsx("span", { className: cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getStatusClass(user.status)), children: user.status }) }),
      /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => onViewProfile(user), className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1", title: "View Profile", children: /* @__PURE__ */ jsx(ViewIcon$1, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onEdit(user), className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 p-1", title: "Edit User", children: /* @__PURE__ */ jsx(EditIcon$1, { className: "h-5 w-5" }) }),
        user.status === "Active" ? /* @__PURE__ */ jsx("button", { onClick: () => onSuspend(user), className: "text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200 p-1", title: "Suspend User", children: /* @__PURE__ */ jsx(SuspendIcon, { className: "h-5 w-5" }) }) : /* @__PURE__ */ jsx("button", { onClick: () => onRestore(user), className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 p-1", title: "Restore User", children: /* @__PURE__ */ jsx(RestoreIcon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onChangePassword(user), className: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-1", title: "Change Password", children: /* @__PURE__ */ jsx(PasswordIcon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(user), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1", title: "Delete User", children: /* @__PURE__ */ jsx(DeleteIcon$1, { className: "h-5 w-5" }) })
      ] })
    ] }, user.id)) })
  ] }) });
}
const mockGroups = [
  { id: "g1", name: "Development Team" },
  { id: "g2", name: "Marketing Department" },
  { id: "g3", name: "Support Staff" },
  { id: "g4", name: "Unassigned" }
];
const mockUsers = [
  {
    id: "u1",
    fullName: "Alice Wonderland",
    email: "alice@example.com",
    groupId: "g1",
    role: "Super Admin",
    status: "Active",
    balance: 1500,
    createdAt: "2023-10-01"
  },
  {
    id: "u2",
    fullName: "Bob The Builder",
    email: "bob@example.com",
    groupId: "g1",
    role: "Admin",
    status: "Active",
    balance: 800,
    createdAt: "2023-10-05"
  },
  {
    id: "u3",
    fullName: "Charlie Chaplin",
    email: "charlie@example.com",
    groupId: "g2",
    role: "User",
    status: "Active",
    balance: 350,
    createdAt: "2023-10-10"
  },
  {
    id: "u4",
    fullName: "Diana Prince",
    email: "diana@example.com",
    groupId: "g2",
    role: "User",
    status: "Suspended",
    balance: 50,
    createdAt: "2023-10-15"
  },
  {
    id: "u5",
    fullName: "Ethan Hunt",
    email: "ethan@example.com",
    groupId: "g3",
    role: "User",
    status: "Active",
    balance: 1200,
    createdAt: "2023-11-01"
  },
  {
    id: "u6",
    fullName: "Fiona Gallagher",
    email: "fiona@example.com",
    groupId: "g4",
    role: "Admin",
    status: "Active",
    balance: 950,
    createdAt: "2023-11-05"
  }
].map((user) => {
  var _a;
  return {
    ...user,
    // Add groupName based on groupId for easier display
    groupName: ((_a = mockGroups.find((g) => g.id === user.groupId)) == null ? void 0 : _a.name) || "Unknown Group"
  };
});
const addUser = (newUser) => {
  var _a;
  console.log("Attempting to add user:", newUser);
  const id = `u${mockUsers.length + 1}`;
  const groupName = ((_a = mockGroups.find((g) => g.id === newUser.groupId)) == null ? void 0 : _a.name) || "Unknown Group";
  const userWithDetails = {
    ...newUser,
    id,
    groupName,
    balance: 0,
    // Default balance
    createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    // Today's date
  };
  mockUsers.push(userWithDetails);
  console.log("User added, updated mockUsers:", mockUsers);
  return userWithDetails;
};
const updateUser = (updatedUser) => {
  var _a;
  const index = mockUsers.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    const groupName = ((_a = mockGroups.find((g) => g.id === updatedUser.groupId)) == null ? void 0 : _a.name) || "Unknown Group";
    mockUsers[index] = { ...updatedUser, groupName };
    console.log("User updated:", mockUsers[index]);
    return true;
  }
  console.log("User not found for update:", updatedUser.id);
  return false;
};
const deleteUser = (userId) => {
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    console.log("User deleted:", userId);
    return true;
  }
  console.log("User not found for deletion:", userId);
  return false;
};
function AddUserModal({ isOpen, onClose, onAddUser }) {
  var _a;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [groupId, setGroupId] = useState(((_a = mockGroups[0]) == null ? void 0 : _a.id) || "");
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!groupId) newErrors.group = "Group is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    var _a2;
    e.preventDefault();
    if (validateForm()) {
      onAddUser({
        fullName,
        email,
        groupId,
        role,
        status
      });
      setFullName("");
      setEmail("");
      setGroupId(((_a2 = mockGroups[0]) == null ? void 0 : _a2.id) || "");
      setRole("User");
      setStatus("Active");
      setErrors({});
      onClose();
    }
  };
  const handleClose = () => {
    var _a2;
    setFullName("");
    setEmail("");
    setGroupId(((_a2 = mockGroups[0]) == null ? void 0 : _a2.id) || "");
    setRole("User");
    setStatus("Active");
    setErrors({});
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: "Add New User" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "fullName", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Full Name ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "fullName",
            value: fullName,
            onChange: (e) => setFullName(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        ),
        errors.fullName && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.fullName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Email ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            id: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        ),
        errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "group", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Group ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "group",
            value: groupId,
            onChange: (e) => setGroupId(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.group ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true,
            children: mockGroups.map((group) => /* @__PURE__ */ jsx("option", { value: group.id, children: group.name }, group.id))
          }
        ),
        errors.group && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.group })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Role" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "role",
            value: role,
            onChange: (e) => setRole(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "User", children: "User" }),
              /* @__PURE__ */ jsx("option", { value: "Admin", children: "Admin" }),
              /* @__PURE__ */ jsx("option", { value: "Super Admin", children: "Super Admin" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "status",
            value: status,
            onChange: (e) => setStatus(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "Suspended", children: "Suspended" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClose,
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
            children: "Add User"
          }
        )
      ] })
    ] })
  ] }) });
}
function DownloadIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
  ] });
}
function UploadIcon$2(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "3", y2: "15" })
  ] });
}
function AlertCircleIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "8", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" })
  ] });
}
function CheckCircleIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    /* @__PURE__ */ jsx("path", { d: "m9 11 3 3L22 4" })
  ] });
}
const expectedColumns = ["FullName", "Email", "GroupName", "Role", "Status"];
const validRoles = ["Super Admin", "Admin", "User"];
const validStatuses = ["Active", "Suspended"];
function BulkUploadModal({ isOpen, onClose, onBulkUpload }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [processingError, setProcessingError] = useState(null);
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.name.endsWith(".xlsx")) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setUploadResult(null);
        setProcessingError(null);
      } else {
        alert("Please upload a valid .xlsx file.");
        event.target.value = "";
      }
    }
  };
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([expectedColumns]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users Template");
    XLSX.writeFile(wb, "LifeEconomy_User_Template.xlsx");
  };
  const processUpload = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);
    setUploadResult(null);
    setProcessingError(null);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a, _b, _c, _d, _e, _f;
        try {
          const data = (_a = e.target) == null ? void 0 : _a.result;
          if (!data) throw new Error("Failed to read file data.");
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (!jsonData || jsonData.length < 2) {
            throw new Error("File is empty or contains only headers.");
          }
          const headers = jsonData[0];
          const missingHeaders = expectedColumns.filter((h) => !headers.includes(h));
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
          }
          const usersToUpload = [];
          const errors = [];
          const groupMap = new Map(mockGroups.map((g) => [g.name.toLowerCase(), g.id]));
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            const rowNum = i + 1;
            const fullName = (_b = rowData.FullName) == null ? void 0 : _b.trim();
            const email = (_c = rowData.Email) == null ? void 0 : _c.trim();
            const groupName = (_d = rowData.GroupName) == null ? void 0 : _d.trim();
            const role = (_e = rowData.Role) == null ? void 0 : _e.trim();
            const status = (_f = rowData.Status) == null ? void 0 : _f.trim();
            let rowHasError = false;
            if (!fullName) {
              errors.push({ row: rowNum, message: "FullName is required." });
              rowHasError = true;
            }
            if (!email) {
              errors.push({ row: rowNum, message: "Email is required." });
              rowHasError = true;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
              errors.push({ row: rowNum, message: "Email format is invalid." });
              rowHasError = true;
            }
            if (!groupName) {
              errors.push({ row: rowNum, message: "GroupName is required." });
              rowHasError = true;
            }
            const groupId = groupMap.get(groupName == null ? void 0 : groupName.toLowerCase());
            if (groupName && !groupId) {
              errors.push({ row: rowNum, message: `Group '${groupName}' not found.` });
              rowHasError = true;
            }
            if (!role) {
              errors.push({ row: rowNum, message: "Role is required." });
              rowHasError = true;
            } else if (!validRoles.includes(role)) {
              errors.push({ row: rowNum, message: `Invalid Role '${role}'. Valid roles: ${validRoles.join(", ")}` });
              rowHasError = true;
            }
            if (!status) {
              errors.push({ row: rowNum, message: "Status is required." });
              rowHasError = true;
            } else if (!validStatuses.includes(status)) {
              errors.push({ row: rowNum, message: `Invalid Status '${status}'. Valid statuses: ${validStatuses.join(", ")}` });
              rowHasError = true;
            }
            if (!rowHasError && groupId) {
              usersToUpload.push({ fullName, email, groupId, role, status });
            }
          }
          if (errors.length > 0) {
            setUploadResult({ successCount: 0, errors });
          } else if (usersToUpload.length > 0) {
            const result = onBulkUpload(usersToUpload);
            setUploadResult(result);
          } else {
            setProcessingError("No valid user data found in the file to upload.");
          }
        } catch (err) {
          console.error("Error processing XLSX file:", err);
          setProcessingError(`Error processing file: ${err.message || "Unknown error"}`);
          setUploadResult(null);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        setProcessingError("Error reading the file.");
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Upload error:", error);
      setProcessingError(`An unexpected error occurred: ${error.message}`);
      setIsProcessing(false);
    }
  }, [file, onBulkUpload]);
  const handleClose = () => {
    setFile(null);
    setFileName("");
    setIsProcessing(false);
    setUploadResult(null);
    setProcessingError(null);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: "Bulk Upload Users" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: downloadTemplate,
          className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm",
          children: [
            /* @__PURE__ */ jsx(DownloadIcon$1, { className: "h-4 w-4" }),
            "Download .xlsx Template"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
        "Download the template, fill in user details, and upload the file below. Required columns: ",
        expectedColumns.join(", "),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Upload .xlsx File" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-gray-300 dark:border-gray-600 rounded-md", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "file-upload", className: "flex-grow px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer truncate", children: fileName || "Choose file..." }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "file-upload",
            type: "file",
            accept: ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            onChange: handleFileChange,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              var _a;
              return (_a = document.getElementById("file-upload")) == null ? void 0 : _a.click();
            },
            className: "px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 text-sm",
            disabled: isProcessing,
            children: "Browse"
          }
        )
      ] })
    ] }),
    isProcessing && /* @__PURE__ */ jsx("div", { className: "text-center my-4 text-blue-600 dark:text-blue-400", children: "Processing... Please wait." }),
    processingError && /* @__PURE__ */ jsx("div", { className: "my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircleIcon, { className: "h-5 w-5 flex-shrink-0" }),
      /* @__PURE__ */ jsx("span", { children: processingError })
    ] }) }),
    uploadResult && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-md font-semibold text-gray-800 dark:text-gray-200", children: "Upload Summary" }),
      uploadResult.successCount > 0 && /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CheckCircleIcon, { className: "h-5 w-5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Successfully processed ",
          uploadResult.successCount,
          " users."
        ] })
      ] }) }),
      uploadResult.errors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(AlertCircleIcon, { className: "h-5 w-5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            "Found ",
            uploadResult.errors.length,
            " errors:"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside max-h-40 overflow-y-auto text-xs space-y-1", children: uploadResult.errors.map((err, index) => /* @__PURE__ */ jsxs("li", { children: [
          "Row ",
          err.row,
          ": ",
          err.message
        ] }, index)) })
      ] }),
      uploadResult.successCount === 0 && uploadResult.errors.length === 0 && !processingError && /* @__PURE__ */ jsx("div", { className: "p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircleIcon, { className: "h-5 w-5 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: "No users were processed. Check the file for valid data or errors." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleClose,
          className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
          disabled: isProcessing,
          children: uploadResult ? "Close" : "Cancel"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: processUpload,
          className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: !file || isProcessing || !!uploadResult,
          children: [
            /* @__PURE__ */ jsx(UploadIcon$2, { className: "h-4 w-4" }),
            isProcessing ? "Processing..." : "Upload & Validate"
          ]
        }
      )
    ] })
  ] }) });
}
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700"
  // Default to danger style
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 dark:text-gray-300 mb-6", children: message }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
          children: cancelText
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            onConfirm();
            onClose();
          },
          className: `px-4 py-2 text-white rounded-md ${confirmButtonClass}`,
          children: confirmText
        }
      )
    ] })
  ] }) });
}
function UserProfileView({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: [
        "User Profile: ",
        user.fullName
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
          children: "× "
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Personal Info" }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Email:" }),
          " ",
          user.email
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Group:" }),
          " ",
          user.groupName
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Role:" }),
          " ",
          user.role
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Status:" }),
          " ",
          user.status
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "ESSENCE Balance" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold", children: [
          user.balance ?? 0,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-sm font-normal", children: "ESSENCE" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Transaction History" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: Table with Date, Type, Amount, Description, Search, Date Filter)" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Activity Log" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: Table of user actions - login, updates, etc.)" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Rewards Summary" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: Total rewards, list with reasons/dates)" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Expenses List" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: Assigned expenses, amounts, frequency)" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Fines Record" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: Fine history, issuer, amount, reasons)" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "p-4 border rounded dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Assigned Activities" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "(Placeholder: List of assigned activities, pay amount, frequency)" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
        children: "Close"
      }
    ) })
  ] }) });
}
function EditUserModal({ user, isOpen, onClose, onUpdateUser }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [groupId, setGroupId] = useState("");
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGroupId(user.groupId);
      setRole(user.role);
      setStatus(user.status);
      setErrors({});
    }
    if (!isOpen) {
      setFullName("");
      setEmail("");
      setGroupId("");
      setRole("User");
      setStatus("Active");
      setErrors({});
    }
  }, [user, isOpen]);
  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!groupId) newErrors.group = "Group is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && validateForm()) {
      onUpdateUser({
        ...user,
        // Keep existing id, balance, etc.
        fullName,
        email,
        groupId,
        role,
        status
      });
      onClose();
    }
  };
  if (!isOpen || !user) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: [
      "Edit User: ",
      user.fullName
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "editFullName", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Full Name ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "editFullName",
            value: fullName,
            onChange: (e) => setFullName(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        ),
        errors.fullName && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.fullName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "editEmail", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Email ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            id: "editEmail",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        ),
        errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "editGroup", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Group ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "editGroup",
            value: groupId,
            onChange: (e) => setGroupId(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.group ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true,
            children: mockGroups.map((group) => /* @__PURE__ */ jsx("option", { value: group.id, children: group.name }, group.id))
          }
        ),
        errors.group && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.group })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "editRole", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Role" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "editRole",
            value: role,
            onChange: (e) => setRole(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "User", children: "User" }),
              /* @__PURE__ */ jsx("option", { value: "Admin", children: "Admin" }),
              /* @__PURE__ */ jsx("option", { value: "Super Admin", children: "Super Admin" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "editStatus", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "editStatus",
            value: status,
            onChange: (e) => setStatus(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "Suspended", children: "Suspended" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
            children: "Update User"
          }
        )
      ] })
    ] })
  ] }) });
}
function ChangePasswordModal({ user, isOpen, onClose, onChangePassword }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (user) {
      onChangePassword(user.id, newPassword);
      console.log(`Password change requested for user ${user.id}`);
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }
  };
  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };
  if (!isOpen || !user) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: [
      "Change Password for ",
      user.fullName
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "New Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            id: "newPassword",
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Confirm New Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            id: "confirmPassword",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: `w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`,
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mb-4", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClose,
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
            children: "Set New Password"
          }
        )
      ] })
    ] })
  ] }) });
}
function PlusIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "5", y2: "19" }),
    /* @__PURE__ */ jsx("line", { x1: "5", x2: "19", y1: "12", y2: "12" })
  ] });
}
function UploadIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "3", y2: "15" })
  ] });
}
function SearchIcon$1(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
  ] });
}
function UsersTabContent() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch = searchTerm === "" || user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const groupMatch = filterGroup === "" || user.groupId === filterGroup;
      const roleMatch = filterRole === "" || user.role === filterRole;
      const statusMatch = filterStatus === "" || user.status === filterStatus;
      return searchMatch && groupMatch && roleMatch && statusMatch;
    });
  }, [users, searchTerm, filterGroup, filterRole, filterStatus]);
  const handleAddUser = useCallback((newUser) => {
    const addedUser = addUser(newUser);
    setUsers((prevUsers) => [...prevUsers, addedUser]);
    console.log(`User '${addedUser.fullName}' added successfully.`);
    setIsAddModalOpen(false);
  }, []);
  const handleBulkUpload = useCallback((newUsers) => {
    let successCount = 0;
    const addedUsers = [];
    const errors = [];
    newUsers.forEach((newUser, index) => {
      if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase()) || addedUsers.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        errors.push({ row: index + 2, message: `Email '${newUser.email}' already exists.` });
      } else {
        const addedUser = addUser(newUser);
        addedUsers.push(addedUser);
        successCount++;
      }
    });
    if (addedUsers.length > 0) {
      setUsers((prevUsers) => [...prevUsers, ...addedUsers]);
    }
    console.log(`Bulk upload processed: ${successCount} successes, ${errors.length} errors.`);
    return { successCount, errors };
  }, [users]);
  const handleEditUser = useCallback((userToEdit) => {
    setSelectedUser(userToEdit);
    setIsEditModalOpen(true);
  }, []);
  const handleUpdateUser = useCallback((updatedUserData) => {
    const success = updateUser(updatedUserData);
    if (success) {
      setUsers((prevUsers) => prevUsers.map((u) => u.id === updatedUserData.id ? updatedUserData : u));
      console.log(`User '${updatedUserData.fullName}' updated successfully.`);
    } else {
      console.error(`Failed to update user '${updatedUserData.fullName}'.`);
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }, []);
  const handleDeleteUser = useCallback((userToDelete) => {
    setSelectedUser(userToDelete);
    setIsDeleteModalOpen(true);
  }, []);
  const confirmDeleteUser = useCallback(() => {
    if (selectedUser) {
      const success = deleteUser(selectedUser.id);
      if (success) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
        console.log(`User '${selectedUser.fullName}' deleted successfully.`);
      } else {
        console.error(`Failed to delete user '${selectedUser.fullName}'.`);
      }
      setSelectedUser(null);
    }
    setIsDeleteModalOpen(false);
  }, [selectedUser]);
  const handleSuspendUser = useCallback((userToSuspend) => {
    setSelectedUser(userToSuspend);
    setIsSuspendModalOpen(true);
  }, []);
  const confirmSuspendUser = useCallback(() => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, status: "Suspended" };
      const success = updateUser(updatedUser);
      if (success) {
        setUsers((prevUsers) => prevUsers.map((u) => u.id === updatedUser.id ? updatedUser : u));
        console.log(`User '${selectedUser.fullName}' suspended successfully.`);
      } else {
        console.error(`Failed to suspend user '${selectedUser.fullName}'.`);
      }
      setSelectedUser(null);
    }
    setIsSuspendModalOpen(false);
  }, [selectedUser]);
  const handleRestoreUser = useCallback((userToRestore) => {
    setSelectedUser(userToRestore);
    setIsRestoreModalOpen(true);
  }, []);
  const confirmRestoreUser = useCallback(() => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, status: "Active" };
      const success = updateUser(updatedUser);
      if (success) {
        setUsers((prevUsers) => prevUsers.map((u) => u.id === updatedUser.id ? updatedUser : u));
        console.log(`User '${selectedUser.fullName}' restored successfully.`);
      } else {
        console.error(`Failed to restore user '${selectedUser.fullName}'.`);
      }
      setSelectedUser(null);
    }
    setIsRestoreModalOpen(false);
  }, [selectedUser]);
  const handleChangePassword = useCallback((userToChangePass) => {
    setSelectedUser(userToChangePass);
    setIsPasswordModalOpen(true);
  }, []);
  const confirmChangePassword = useCallback((userId, newPassword) => {
    console.log(`Password change initiated for user ID: ${userId} with new password: ${newPassword}`);
    setIsPasswordModalOpen(false);
    setSelectedUser(null);
  }, []);
  const handleViewProfile = useCallback((userToView) => {
    setSelectedUser(userToView);
    setIsProfileViewOpen(true);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-b-md dark:border-gray-700 bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "User Management" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsAddModalOpen(true),
            className: "inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
            children: [
              /* @__PURE__ */ jsx(PlusIcon$1, { className: "h-4 w-4" }),
              "Add New User"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsBulkModalOpen(true),
            className: "inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm",
            children: [
              /* @__PURE__ */ jsx(UploadIcon$1, { className: "h-4 w-4" }),
              "Bulk Upload Users"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "search-users", className: "sr-only", children: "Search by name or email" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon$1, { className: "h-5 w-5 text-gray-400" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "search-users",
            placeholder: "Search by name or email...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "filter-group", className: "sr-only", children: "Filter by Group" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "filter-group",
            value: filterGroup,
            onChange: (e) => setFilterGroup(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Groups" }),
              mockGroups.map((group) => /* @__PURE__ */ jsx("option", { value: group.id, children: group.name }, group.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "filter-role", className: "sr-only", children: "Filter by Role" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "filter-role",
            value: filterRole,
            onChange: (e) => setFilterRole(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Roles" }),
              /* @__PURE__ */ jsx("option", { value: "Super Admin", children: "Super Admin" }),
              /* @__PURE__ */ jsx("option", { value: "Admin", children: "Admin" }),
              /* @__PURE__ */ jsx("option", { value: "User", children: "User" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "filter-status", className: "sr-only", children: "Filter by Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "filter-status",
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Statuses" }),
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "Suspended", children: "Suspended" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      UsersTable,
      {
        users: filteredUsers,
        onViewProfile: handleViewProfile,
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
        onSuspend: handleSuspendUser,
        onRestore: handleRestoreUser,
        onChangePassword: handleChangePassword
      }
    ),
    /* @__PURE__ */ jsx(
      AddUserModal,
      {
        isOpen: isAddModalOpen,
        onClose: () => setIsAddModalOpen(false),
        onAddUser: handleAddUser
      }
    ),
    /* @__PURE__ */ jsx(
      BulkUploadModal,
      {
        isOpen: isBulkModalOpen,
        onClose: () => setIsBulkModalOpen(false),
        onBulkUpload: handleBulkUpload
      }
    ),
    /* @__PURE__ */ jsx(
      EditUserModal,
      {
        isOpen: isEditModalOpen,
        user: selectedUser,
        onClose: () => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        },
        onUpdateUser: handleUpdateUser
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        isOpen: isDeleteModalOpen,
        onClose: () => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        },
        onConfirm: confirmDeleteUser,
        title: "Confirm Deletion",
        message: /* @__PURE__ */ jsxs("span", { children: [
          "Are you sure you want to delete user ",
          /* @__PURE__ */ jsx("strong", { children: selectedUser == null ? void 0 : selectedUser.fullName }),
          "? This action cannot be undone."
        ] }),
        confirmText: "Delete",
        confirmButtonClass: "bg-red-600 hover:bg-red-700"
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        isOpen: isSuspendModalOpen,
        onClose: () => {
          setIsSuspendModalOpen(false);
          setSelectedUser(null);
        },
        onConfirm: confirmSuspendUser,
        title: "Confirm Suspension",
        message: /* @__PURE__ */ jsxs("span", { children: [
          "Are you sure you want to suspend user ",
          /* @__PURE__ */ jsx("strong", { children: selectedUser == null ? void 0 : selectedUser.fullName }),
          "? They will lose access until restored."
        ] }),
        confirmText: "Suspend",
        confirmButtonClass: "bg-yellow-600 hover:bg-yellow-700"
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        isOpen: isRestoreModalOpen,
        onClose: () => {
          setIsRestoreModalOpen(false);
          setSelectedUser(null);
        },
        onConfirm: confirmRestoreUser,
        title: "Confirm Restoration",
        message: /* @__PURE__ */ jsxs("span", { children: [
          "Are you sure you want to restore access for user ",
          /* @__PURE__ */ jsx("strong", { children: selectedUser == null ? void 0 : selectedUser.fullName }),
          "?"
        ] }),
        confirmText: "Restore",
        confirmButtonClass: "bg-green-600 hover:bg-green-700"
      }
    ),
    /* @__PURE__ */ jsx(
      ChangePasswordModal,
      {
        isOpen: isPasswordModalOpen,
        user: selectedUser,
        onClose: () => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
        },
        onChangePassword: confirmChangePassword
      }
    ),
    /* @__PURE__ */ jsx(
      UserProfileView,
      {
        isOpen: isProfileViewOpen,
        user: selectedUser,
        onClose: () => {
          setIsProfileViewOpen(false);
          setSelectedUser(null);
        }
      }
    )
  ] });
}
function PlusIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "5", y2: "19" }),
    /* @__PURE__ */ jsx("line", { x1: "5", x2: "19", y1: "12", y2: "12" })
  ] });
}
function EditIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
    /* @__PURE__ */ jsx("path", { d: "m15 5 4 4" })
  ] });
}
function DeleteIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
    /* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    /* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    /* @__PURE__ */ jsx("line", { x1: "10", x2: "10", y1: "11", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "14", x2: "14", y1: "11", y2: "17" })
  ] });
}
function ViewIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] });
}
function SearchIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
  ] });
}
function AddEditGroupModal({ isOpen, onClose, group, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  React.useEffect(() => {
    if (isOpen) {
      setName((group == null ? void 0 : group.name) || "");
      setDescription((group == null ? void 0 : group.description) || "");
      setType((group == null ? void 0 : group.type) || "");
      setError("");
    }
  }, [isOpen, group]);
  const handleSave = () => {
    if (!name.trim()) {
      setError("Group Name is required.");
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), type: type.trim() });
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: group ? "Edit Group" : "Add New Group" }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mb-3", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { htmlFor: "groupName", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          "Group Name ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "groupName", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "groupDesc", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { id: "groupDesc", value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "groupType", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Group Type" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "groupType", value: type, onChange: (e) => setType(e.target.value), placeholder: "e.g., Squad, Team", className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: group ? "Update Group" : "Add Group" })
    ] })
  ] }) });
}
function ViewMembersModal({ isOpen, onClose, group, users }) {
  if (!isOpen || !group) return null;
  const members = users.filter((u) => u.groupId === group.id);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: [
      "Members of ",
      group.name,
      " (",
      members.length,
      ")"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow overflow-y-auto mb-4 border dark:border-gray-700 rounded", children: members.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-4 text-gray-500 dark:text-gray-400", children: "No users found in this group." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y dark:divide-gray-700", children: members.map((user) => /* @__PURE__ */ jsxs("li", { className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-300", children: [
      user.fullName,
      " (",
      user.email,
      ") - ",
      user.role
    ] }, user.id)) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500", children: "Close" }) })
  ] }) });
}
function GroupsManagement() {
  const [allUsers] = useState(mockUsers);
  const [groups, setGroups] = useState(
    () => mockGroups.map((g) => ({
      ...g,
      description: `Description for ${g.name}`,
      // Placeholder
      type: ["Squad", "Team", "Academic Group", "Other"][Math.floor(Math.random() * 4)],
      // Placeholder
      userCount: allUsers.filter((u) => u.groupId === g.id).length
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groupTypes = useMemo(() => [...new Set(groups.map((g) => g.type).filter(Boolean))], [groups]);
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const searchMatch = searchTerm === "" || group.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === "" || group.type === filterType;
      return searchMatch && typeMatch;
    });
  }, [groups, searchTerm, filterType]);
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsAddEditModalOpen(true);
  };
  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setIsAddEditModalOpen(true);
  };
  const handleSaveGroup = (groupData) => {
    if (selectedGroup) {
      setGroups((prev) => prev.map((g) => g.id === selectedGroup.id ? { ...selectedGroup, ...groupData } : g));
      console.log("Updated group:", { ...selectedGroup, ...groupData });
    } else {
      const newGroup = {
        ...groupData,
        id: `g${Date.now()}`,
        // Simple unique ID generation
        userCount: 0
      };
      setGroups((prev) => [...prev, newGroup]);
      console.log("Added group:", newGroup);
    }
  };
  const handleDeleteGroup = (group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteGroup = () => {
    if (selectedGroup) {
      if (selectedGroup.userCount && selectedGroup.userCount > 0) {
        alert(`Cannot delete group "${selectedGroup.name}" because it has ${selectedGroup.userCount} member(s). Please reassign users first.`);
        setIsDeleteModalOpen(false);
        setSelectedGroup(null);
        return;
      }
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));
      console.log("Deleted group:", selectedGroup.id);
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
  };
  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setIsViewMembersModalOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-md dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white", children: "Groups Management" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAddGroup,
          className: "inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
          children: [
            /* @__PURE__ */ jsx(PlusIcon, { className: "h-4 w-4" }),
            "Add New Group"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "search-groups", className: "sr-only", children: "Search by group name" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(SearchIcon, { className: "h-5 w-5 text-gray-400" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "search-groups",
              placeholder: "Search groups...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full md:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "filter-group-type", className: "sr-only", children: "Filter by Group Type" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "filter-group-type",
              value: filterType,
              onChange: (e) => setFilterType(e.target.value),
              className: "w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Types" }),
                groupTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type }, type))
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Group Name" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Type" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "User Count" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: filteredGroups.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400", children: "No groups found matching your criteria." }) }) : filteredGroups.map((group) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white", children: group.name }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: group.type || "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: group.userCount }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => handleViewMembers(group), className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1", title: "View Members", children: /* @__PURE__ */ jsx(ViewIcon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleEditGroup(group), className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 p-1", title: "Edit Group", children: /* @__PURE__ */ jsx(EditIcon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteGroup(group), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1", title: "Delete Group", children: /* @__PURE__ */ jsx(DeleteIcon, { className: "h-5 w-5" }) })
        ] })
      ] }, group.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      AddEditGroupModal,
      {
        isOpen: isAddEditModalOpen,
        onClose: () => setIsAddEditModalOpen(false),
        group: selectedGroup,
        onSave: handleSaveGroup
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        isOpen: isDeleteModalOpen,
        onClose: () => {
          setIsDeleteModalOpen(false);
          setSelectedGroup(null);
        },
        onConfirm: confirmDeleteGroup,
        title: "Confirm Group Deletion",
        message: /* @__PURE__ */ jsxs("span", { children: [
          "Are you sure you want to delete the group ",
          /* @__PURE__ */ jsx("strong", { children: selectedGroup == null ? void 0 : selectedGroup.name }),
          "? This action cannot be undone",
          (selectedGroup == null ? void 0 : selectedGroup.userCount) && selectedGroup.userCount > 0 ? " and the group currently has members" : "",
          "."
        ] }),
        confirmText: "Delete",
        confirmButtonClass: "bg-red-600 hover:bg-red-700"
      }
    ),
    /* @__PURE__ */ jsx(
      ViewMembersModal,
      {
        isOpen: isViewMembersModalOpen,
        onClose: () => {
          setIsViewMembersModalOpen(false);
          setSelectedGroup(null);
        },
        group: selectedGroup,
        users: allUsers
      }
    )
  ] });
}
function EssenceSettings() {
  const [settings, setSettings] = useState({
    maxRewardAmount: 1e3,
    maxFineAmount: 500,
    centralFineAccountId: "central-fine@example.com",
    // Placeholder
    enableGroupActions: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setTempSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleSave = () => {
    console.log("Saving Essence Settings:", tempSettings);
    setSettings(tempSettings);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-md dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Essence Settings" }),
      !isEditing && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setTempSettings(settings);
            setIsEditing(true);
          },
          className: "text-sm text-blue-600 hover:underline dark:text-blue-400",
          children: "Edit Settings"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "maxRewardAmount", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Maximum Reward Amount" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            id: "maxRewardAmount",
            name: "maxRewardAmount",
            value: isEditing ? tempSettings.maxRewardAmount : settings.maxRewardAmount,
            onChange: handleInputChange,
            disabled: !isEditing,
            className: "w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700",
            min: "0"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Set the highest amount allowed for a single reward." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "maxFineAmount", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Maximum Fine Amount" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            id: "maxFineAmount",
            name: "maxFineAmount",
            value: isEditing ? tempSettings.maxFineAmount : settings.maxFineAmount,
            onChange: handleInputChange,
            disabled: !isEditing,
            className: "w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700",
            min: "0"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Set the highest amount allowed for a single fine." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "centralFineAccountId", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Central Fine Account Identifier" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "centralFineAccountId",
            name: "centralFineAccountId",
            value: isEditing ? tempSettings.centralFineAccountId : settings.centralFineAccountId,
            onChange: handleInputChange,
            disabled: !isEditing,
            placeholder: "Enter User ID or Email",
            className: "w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Specify the user account where collected fines are sent." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "enableGroupActions",
            name: "enableGroupActions",
            checked: isEditing ? tempSettings.enableGroupActions : settings.enableGroupActions,
            onChange: handleInputChange,
            disabled: !isEditing,
            className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70"
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "enableGroupActions", className: "ml-2 block text-sm text-gray-900 dark:text-gray-300", children: "Enable Group-Based Economic Actions" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 -mt-3 ml-6", children: "Allow admins to assign rewards/fines/expenses to entire groups." }),
      isEditing && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t dark:border-gray-700", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCancel,
            className: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSave,
            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
            children: "Save Settings"
          }
        )
      ] })
    ] })
  ] });
}
function DownloadIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
  ] });
}
function UploadIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
    /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "3", y2: "15" })
  ] });
}
function FileTextIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }),
    /* @__PURE__ */ jsx("path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }),
    /* @__PURE__ */ jsx("path", { d: "M10 9H8" }),
    /* @__PURE__ */ jsx("path", { d: "M16 13H8" }),
    /* @__PURE__ */ jsx("path", { d: "M16 17H8" })
  ] });
}
function DatabaseIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }),
    /* @__PURE__ */ jsx("path", { d: "M3 12A9 3 0 0 0 21 12" })
  ] });
}
function ArchiveIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }),
    /* @__PURE__ */ jsx("path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }),
    /* @__PURE__ */ jsx("path", { d: "M10 12h4" })
  ] });
}
function BackupRestore() {
  const [exportModules, setExportModules] = useState([]);
  const [exportFormat, setExportFormat] = useState("json");
  const [includeLogs, setIncludeLogs] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importFileName, setImportFileName] = useState("");
  const [importModule, setImportModule] = useState("");
  const [importMode, setImportMode] = useState("merge");
  const [importPreview, setImportPreview] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [auditLog, setAuditLog] = useState([
    // Placeholder data
    { id: "log1", actionType: "Export", modules: ["config", "groups"], performedBy: "Super Admin", timestamp: new Date(Date.now() - 864e5).toISOString(), status: "Success" },
    { id: "log2", actionType: "Import", fileName: "users_import_v2.csv", performedBy: "Super Admin", timestamp: (/* @__PURE__ */ new Date()).toISOString(), status: "Failed", details: "Row 15: Invalid email format. Row 22: User ID not found." }
  ]);
  const [filterDate, setFilterDate] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const handleExportSelection = (module, type) => {
    setExportModules((prev) => {
      if (type === "config") {
        return prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module];
      } else {
        if (module === "activityLogs") return prev;
        return prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module];
      }
    });
  };
  const handleExport = (type) => {
    console.log(`Exporting... Type: ${type}`);
    console.log("Selected Modules:", exportModules);
    console.log("Include Logs:", includeLogs);
    console.log("Format:", exportFormat);
    let modulesToExport = [];
    if (type === "selected") modulesToExport = exportModules;
    if (type === "all_config") modulesToExport = ["config", "groups", "essenceSettings"];
    if (type === "all_data") modulesToExport = ["users", "balances", "transactions", "economySetup", ...includeLogs ? ["activityLogs"] : []];
    if (type === "zip") modulesToExport = ["config", "groups", "essenceSettings", "users", "balances", "transactions", "economySetup", ...includeLogs ? ["activityLogs"] : []];
    if (modulesToExport.length === 0 && type === "selected") {
      alert("Please select at least one module to export.");
      return;
    }
    alert(`Placeholder: Export initiated for ${type} (${modulesToExport.join(", ")}) as ${exportFormat}. Check console.`);
    setAuditLog((prev) => [{
      id: `log${Date.now()}`,
      actionType: "Export",
      modules: modulesToExport,
      performedBy: "Current Super Admin",
      // Get actual user later
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Success"
      // Assume success for placeholder
    }, ...prev]);
  };
  const handleImportFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImportFile(file);
      setImportFileName(file.name);
      setImportPreview(null);
      setImportErrors([]);
    }
  };
  const handleImport = () => {
    if (!importFile || !importModule) {
      alert("Please select a file and the corresponding data module to import.");
      return;
    }
    console.log(`Importing file: ${importFileName}`);
    console.log(`Module: ${importModule}`);
    console.log(`Mode: ${importMode}`);
    alert(`Placeholder: Import initiated for ${importModule} from ${importFileName} (Mode: ${importMode}). Check console.`);
    setAuditLog((prev) => [{
      id: `log${Date.now()}`,
      actionType: "Import",
      fileName: importFileName,
      modules: [importModule],
      performedBy: "Current Super Admin",
      // Get actual user later
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Success"
      // Assume success for placeholder
    }, ...prev]);
    setImportFile(null);
    setImportFileName("");
    setImportModule("");
    setImportPreview(null);
    setImportErrors([]);
  };
  const filteredAuditLog = useMemo(() => {
    return auditLog.filter((log) => {
      const dateMatch = !filterDate || log.timestamp.startsWith(filterDate);
      const actionMatch = !filterAction || log.actionType === filterAction;
      return dateMatch && actionMatch;
    });
  }, [auditLog, filterDate, filterAction]);
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-md dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm space-y-8", children: [
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white", children: "Export Data" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded dark:border-gray-600", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-medium mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileTextIcon, { className: "w-5 h-5" }),
            "Configuration Modules"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("groups"), onChange: () => handleExportSelection("groups", "config"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Groups"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("essenceSettings"), onChange: () => handleExportSelection("essenceSettings", "config"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Essence Settings"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleExport("all_config"),
              className: "mt-3 inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs",
              children: [
                /* @__PURE__ */ jsx(DownloadIcon, { className: "h-3 w-3" }),
                " Export All Config"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded dark:border-gray-600", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-medium mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(DatabaseIcon, { className: "w-5 h-5" }),
            "Full Data Modules"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("users"), onChange: () => handleExportSelection("users", "full"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Users"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("balances"), onChange: () => handleExportSelection("balances", "full"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " User Balances"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("transactions"), onChange: () => handleExportSelection("transactions", "full"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Transactions"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: exportModules.includes("economySetup"), onChange: () => handleExportSelection("economySetup", "full"), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Economy Setup (Activities/Expenses)"
            ] }),
            /* @__PURE__ */ jsx("hr", { className: "my-2 dark:border-gray-600" }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: includeLogs, onChange: (e) => setIncludeLogs(e.target.checked), className: "form-checkbox h-4 w-4 text-blue-600" }),
              " Include Activity Logs (Optional)"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleExport("all_data"),
              className: "mt-3 inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs",
              children: [
                /* @__PURE__ */ jsx(DownloadIcon, { className: "h-3 w-3" }),
                " Export All Data"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "exportFormat", className: "text-sm font-medium mr-2", children: "Format:" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "exportFormat",
              value: exportFormat,
              onChange: (e) => setExportFormat(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "json", children: "JSON" }),
                /* @__PURE__ */ jsx("option", { value: "csv", children: "CSV" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-grow flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleExport("selected"),
              disabled: exportModules.length === 0,
              className: "inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                /* @__PURE__ */ jsx(DownloadIcon, { className: "h-4 w-4" }),
                " Export Selected (",
                exportModules.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleExport("zip"),
              className: "inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm",
              children: [
                /* @__PURE__ */ jsx(ArchiveIcon, { className: "h-4 w-4" }),
                " Download All as ZIP"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "dark:border-gray-700" }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white", children: "Import Data" }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-800", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "importFile", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Select File (.json or .csv)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                id: "importFile",
                accept: ".json,.csv",
                onChange: handleImportFileChange,
                className: "block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
              }
            ),
            importFileName && /* @__PURE__ */ jsxs("p", { className: "text-xs mt-1 text-gray-600 dark:text-gray-400 truncate", children: [
              "Selected: ",
              importFileName
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "importModule", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Data Module" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "importModule",
                value: importModule,
                onChange: (e) => setImportModule(e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select module..." }),
                  /* @__PURE__ */ jsx("option", { value: "users", children: "Users" }),
                  /* @__PURE__ */ jsx("option", { value: "balances", children: "User Balances" }),
                  /* @__PURE__ */ jsx("option", { value: "transactions", children: "Transactions" }),
                  /* @__PURE__ */ jsx("option", { value: "groups", children: "Groups" }),
                  /* @__PURE__ */ jsx("option", { value: "economySetup", children: "Economy Setup (Activities/Expenses)" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-end gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "importMode", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Import Mode" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "importMode",
                  value: importMode,
                  onChange: (e) => setImportMode(e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "merge", children: "Merge with existing" }),
                    /* @__PURE__ */ jsx("option", { value: "overwrite", children: "Overwrite existing" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleImport,
                disabled: !importFile || !importModule,
                className: "w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                children: [
                  /* @__PURE__ */ jsx(UploadIcon, { className: "h-4 w-4" }),
                  " Import"
                ]
              }
            )
          ] })
        ] }),
        importErrors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "Import Validation Errors:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-xs", children: importErrors.map((err, i) => /* @__PURE__ */ jsx("li", { children: err }, i)) })
        ] }),
        importPreview && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "Import Preview:" }),
          /* @__PURE__ */ jsx("pre", { className: "text-xs max-h-40 overflow-auto bg-white dark:bg-gray-900 p-2 rounded", children: JSON.stringify(importPreview, null, 2) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: "Note: 'Overwrite' mode requires confirmation. Validation checks headers, data types, and references (e.g., User IDs). Preview shows sample data before import." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "dark:border-gray-700" }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white", children: "Import/Export Audit Trail" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "filterDate", className: "text-sm font-medium mr-2", children: "Date:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "filterDate",
              value: filterDate,
              onChange: (e) => setFilterDate(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "filterAction", className: "text-sm font-medium mr-2", children: "Action:" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "filterAction",
              value: filterAction,
              onChange: (e) => setFilterAction(e.target.value),
              className: "px-3 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Actions" }),
                /* @__PURE__ */ jsx("option", { value: "Import", children: "Import" }),
                /* @__PURE__ */ jsx("option", { value: "Export", children: "Export" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded dark:border-gray-700", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Timestamp" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Action" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Details" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Performed By" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: filteredAuditLog.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400", children: "No audit log entries found matching your criteria." }) }) : filteredAuditLog.map((log) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: new Date(log.timestamp).toLocaleString() }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm font-medium", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.actionType === "Import" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}`, children: log.actionType }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-sm text-gray-500 dark:text-gray-400", children: [
            log.fileName ? `File: ${log.fileName}` : "",
            log.modules ? ` Modules: ${log.modules.join(", ")}` : "",
            log.details ? /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 dark:text-red-400 mt-1", children: log.details }) : ""
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: log.performedBy }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.status === "Success" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : log.status === "Failed" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`, children: log.status }) })
        ] }, log.id)) })
      ] }) })
    ] })
  ] });
}
const meta = () => {
  return [
    { title: "Life Economy - Admin" },
    { name: "description", content: "Admin section for Life Economy" }
  ];
};
function UsersIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "4" }),
        /* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
        /* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
      ]
    }
  );
}
function SettingsIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .54 1.73v.5c0 .83-.44 1.56-1.17 1.95l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1.17-1.95v-.5c0-.83.44-1.56 1.17-1.95l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
      ]
    }
  );
}
function MasterTabContent() {
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-b-md dark:border-gray-700 bg-gray-50 dark:bg-gray-950 space-y-6", children: [
    /* @__PURE__ */ jsx(GroupsManagement, {}),
    /* @__PURE__ */ jsx(EssenceSettings, {}),
    /* @__PURE__ */ jsx(BackupRestore, {})
  ] });
}
function Admin() {
  const userRole = useUserRole();
  const [activeTab, setActiveTab] = useState("users");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient || userRole !== "Super Admin") {
    if (!isClient) return null;
    return /* @__PURE__ */ jsx(AccessDenied, { requiredRole: "Super Admin" });
  }
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return /* @__PURE__ */ jsx(UsersTabContent, {});
      case "master":
        return /* @__PURE__ */ jsx(MasterTabContent, {});
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4 md:p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-6 text-gray-900 dark:text-white", children: "Admin Console" }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-gray-200 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("users"),
          className: cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "users" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          ),
          children: [
            /* @__PURE__ */ jsx(UsersIcon, { className: "h-5 w-5" }),
            "Users"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("master"),
          className: cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "master" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          ),
          children: [
            /* @__PURE__ */ jsx(SettingsIcon, { className: "h-5 w-5" }),
            "Master"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-0", children: [
      " ",
      renderContent()
    ] })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Admin,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Q9A-ARLL.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/components-D_nUPfgz.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-kbk3lkcC.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/components-D_nUPfgz.js", "/assets/utils-BNf5BS2b.js", "/assets/useUserRole-CB3F7YuP.js"], "css": ["/assets/root-BP8lITaq.css"] }, "routes/transactions": { "id": "routes/transactions", "parentId": "root", "path": "transactions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/transactions-DeX49wRi.js", "imports": ["/assets/transactions-TCfcHUn8.js", "/assets/jsx-runtime-yvcgGv6i.js"], "css": [] }, "routes/management": { "id": "routes/management", "parentId": "root", "path": "management", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/management-DDZalJb3.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/utils-BNf5BS2b.js"], "css": [] }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings-kja9qyjB.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js"], "css": [] }, "routes/transfer": { "id": "routes/transfer", "parentId": "root", "path": "transfer", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/transfer-Be-p_g6R.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/components-D_nUPfgz.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-28BL4AyM.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/components-D_nUPfgz.js"], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-VtT0RYXy.js", "imports": ["/assets/jsx-runtime-yvcgGv6i.js", "/assets/useUserRole-CB3F7YuP.js", "/assets/components-D_nUPfgz.js", "/assets/utils-BNf5BS2b.js"], "css": [] } }, "url": "/assets/manifest-43c3e254.js", "version": "43c3e254" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/transactions": {
    id: "routes/transactions",
    parentId: "root",
    path: "transactions",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/management": {
    id: "routes/management",
    parentId: "root",
    path: "management",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/transfer": {
    id: "routes/transfer",
    parentId: "root",
    path: "transfer",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map

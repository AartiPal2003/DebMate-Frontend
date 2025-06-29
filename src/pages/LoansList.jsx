import React, { useEffect, useState } from "react";
import axios from "axios";

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [repayAmounts, setRepayAmounts] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/loans");
      setLoans(res.data);
      console.log("Fetched loans ->", res.data);
    } catch (err) {
      console.error("❌ Failed to fetch loans:", err);
    }
  };

  const handleRepayChange = (loanId, value) => {
    setRepayAmounts((prev) => ({ ...prev, [loanId]: value }));
  };

  const handleRepaySubmit = async (loanId) => {
    const amount = Number(repayAmounts[loanId]);
    if (!amount || amount <= 0) {
      alert("Enter a valid repayment amount.");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/loans/${loanId}/repay`, { amount });
      alert("✅ Repayment added!");
      fetchLoans();
      setRepayAmounts((prev) => ({ ...prev, [loanId]: "" }));
    } catch (err) {
      console.error("❌ Error adding repayment:", err);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (loanId) => {
    const confirm = window.confirm("Are you sure you want to delete this loan?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/loans/${loanId}`);
      alert("🗑️ Loan deleted!");
      fetchLoans();
    } catch (err) {
      console.error("❌ Error deleting loan:", err);
      alert("Failed to delete loan.");
    }
  };

  const exportToCSV = () => {
    if (loans.length === 0) return;

    const headers = [
      "S.No.",
      "Lender",
      "Borrower",
      "Purpose",
      "Amount",
      "Remaining",
      "Issued Date",
    ];

    const rows = loans.map((loan, index) => {
      const totalRepaid = loan.repayments?.reduce((sum, rep) => sum + rep.amount, 0);
      const remaining = loan.amount - totalRepaid;

      return [
        index + 1,
        loan.lender,
        loan.borrower,
        loan.purpose,
        `₹${loan.amount}`,
        `₹${remaining}`,
        new Date(loan.dateIssued).toLocaleDateString(),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((col) => `"${col}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "loans_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;
    return loan.role === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-end mb-4">
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded shadow transition duration-200"
          >
            ⬇️ Export CSV
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-6 mt-4 sm:mt-0">
          All Loans
        </h2>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {["all", "giver", "taker"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded text-sm font-medium shadow ${
                filter === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {type === "all" ? "All Loans" : type === "giver" ? "Loans Given" : "Loans Taken"}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full text-sm sm:text-base text-gray-800 border-collapse bg-white rounded-lg shadow">
            <thead className="bg-indigo-600 text-white uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4 text-left">S.No.</th>
                <th className="py-3 px-4 text-left">Lender</th>
                <th className="py-3 px-4 text-left">Borrower</th>
                <th className="py-3 px-4 text-left">Purpose</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Remaining</th>
                <th className="py-3 px-4 text-left">Issued / EMI</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, index) => {
                const totalRepaid = loan.repayments?.reduce((sum, rep) => sum + rep.amount, 0);
                const remaining = loan.amount - totalRepaid;

                // EMI badge logic
                let emiStatus = null;
                if (loan.emi?.enabled) {
                  const today = new Date();
                  const dueDate = new Date(loan.emi.nextDueDate);
                  const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

                  if (diffDays < 0) {
                    emiStatus = { color: "bg-red-100 text-red-700", label: "🔴 Overdue" };
                  } else if (diffDays <= 3) {
                    emiStatus = { color: "bg-yellow-100 text-yellow-800", label: "🟡 Due Soon" };
                  } else {
                    emiStatus = { color: "bg-green-100 text-green-700", label: "🟢 Upcoming" };
                  }
                }

                return (
                  <tr key={loan._id} className="border-t border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{loan.lender}</td>
                    <td className="py-3 px-4">{loan.borrower}</td>
                    <td className="py-3 px-4">{loan.purpose}</td>
                    <td className="py-3 px-4">₹{loan.amount}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">₹{remaining}</td>
                    <td className="py-3 px-4">
                      <div>{new Date(loan.dateIssued).toLocaleDateString()}</div>
                      {emiStatus && (
                        <div
                          className={`text-xs mt-1 inline-block px-2 py-1 rounded-full font-semibold ${emiStatus.color}`}
                        >
                          {emiStatus.label}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="₹"
                          value={repayAmounts[loan._id] || ""}
                          onChange={(e) => handleRepayChange(loan._id, e.target.value)}
                          className="w-full sm:w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => handleRepaySubmit(loan._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Repay
                        </button>
                        <button
                          onClick={() => handleDelete(loan._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No loans found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoansList;

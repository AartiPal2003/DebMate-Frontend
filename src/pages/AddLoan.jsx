import React, { useState } from "react";

import api from "../api";

const AddLoan = () => {
  const [formData, setFormData] = useState({
    lender: "",
    borrower: "",
    amount: "",
    purpose: "",
    role: "",
     emiEnabled: false,
  emiAmount: "",
  emiStartDate: "",
  emiFrequency: "monthly",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    lender: formData.lender,
    borrower: formData.borrower,
    amount: Number(formData.amount),
    purpose: formData.purpose,
    role: formData.role,
    emi: formData.emiEnabled
      ? {
          enabled: true,
          amount: Number(formData.emiAmount),
          startDate: formData.emiStartDate,
          frequency: formData.emiFrequency,
        }
      : { enabled: false }
  };

  try {
    await api.post("/api/loans/add-loan", payload);
    setMessage("✅ Loan added successfully!");
    setFormData({
      lender: "",
      borrower: "",
      amount: "",
      purpose: "",
      role: "",
      emiEnabled: false,
      emiAmount: "",
      emiStartDate: "",
      emiFrequency: "monthly"
    });
  } catch (err) {
    console.error("Error adding loan", err);
    setMessage("❌ Failed to add loan.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl bg-white rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Add a Loan</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="lender"
          placeholder="Lender Name"
          value={formData.lender}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="borrower"
          placeholder="Borrower Name"
          value={formData.borrower}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Loan Type</option>
          <option value="giver">Loan Given</option>
          <option value="taker">Loan Taken</option>
        </select>

        {/* EMI Toggle */}
<div className="mt-4">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={formData.emiEnabled}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, emiEnabled: e.target.checked }))
      }
      className="form-checkbox h-4 w-4 text-indigo-600"
    />
    <span className="ml-2 text-sm text-gray-700 font-medium">Enable EMI</span>
  </label>
</div>

{/* EMI Fields - Conditionally Shown */}
{formData.emiEnabled && (
  <div className="space-y-3 mt-3">
    <input
      type="number"
      name="emiAmount"
      placeholder="EMI Amount"
      value={formData.emiAmount}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, emiAmount: e.target.value }))
      }
      required
      className="w-full p-2 border rounded"
    />

    <label className="block text-sm text-gray-700 font-medium">
      EMI Start Date:
    </label>
    <input
      type="date"
      name="emiStartDate"
      value={formData.emiStartDate}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, emiStartDate: e.target.value }))
      }
      required
      className="w-full p-2 border rounded"
    />

    <label className="block text-sm text-gray-700 font-medium">
      EMI Frequency:
    </label>
    <select
      name="emiFrequency"
      value={formData.emiFrequency}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, emiFrequency: e.target.value }))
      }
      className="w-full p-2 border rounded"
    >
      <option value="monthly">Monthly</option>
      <option value="weekly">Weekly</option>
    </select>
  </div>
)}


        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Loan
        </button>

        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default AddLoan;

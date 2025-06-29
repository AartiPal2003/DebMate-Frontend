import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg("✅ Registration successful! Now login.");
      navigate("/login");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Error occurred"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const { token, user } = res.data;

      // Store token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      navigate("/all-loans");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Login</button>
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
      </form>
      <br></br>

      <p className="text-sm text-center text-gray-600">
  Don’t have an account?{" "}
  
  <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>

  
  
</p>

    </div>
  );
};

export default Login;

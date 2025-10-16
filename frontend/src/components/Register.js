import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    soil: "",
    water: "",
    role: "farmer", // default
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setMessage("✅ Registration successful! Please login.");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {message && <p className="text-sm mb-2">{message}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="soil"
          className="p-2 border rounded"
          value={form.soil}
          onChange={handleChange}
          required
        >
          <option value="">Select Soil Type</option>
          <option value="loamy">Loamy</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
        </select>
        <select
          name="water"
          className="p-2 border rounded"
          value={form.water}
          onChange={handleChange}
          required
        >
          <option value="">Select Water Availability</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          name="role"
          className="p-2 border rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

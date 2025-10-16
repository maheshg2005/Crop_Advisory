import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [rules, setRules] = useState({});
  const [newRule, setNewRule] = useState({
    soil: "",
    season: "",
    crop: "",
    fertilizer: "",
    water: "",
  });

  const token = localStorage.getItem("token");

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then(setUsers);

    fetch("http://localhost:5000/api/admin/advisories", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then(setAdvisories);

    fetch("http://localhost:5000/api/admin/rules", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then(setRules);
  }, [token]);

  // Add new rule
  const handleAddRule = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/admin/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(newRule),
    });
    const data = await res.json();
    alert(data.message);

    // Refresh rules
    const updated = await fetch("http://localhost:5000/api/admin/rules", {
      headers: { Authorization: token },
    }).then((r) => r.json());
    setRules(updated);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        📊 Admin Dashboard
      </h2>

      {/* Users */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">👤 Users</h3>
        <ul className="list-disc pl-6">
          {users.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email}) – {u.role}
            </li>
          ))}
        </ul>
      </section>

      {/* Advisories */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">🌾 Advisories</h3>
        <ul className="list-disc pl-6">
          {advisories.map((a) => (
            <li key={a.id}>
              User {a.user_id}: {a.recommendation}
            </li>
          ))}
        </ul>
      </section>

      {/* Rules */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">📜 Crop Rules</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm max-h-60 overflow-y-auto">
          {JSON.stringify(rules, null, 2)}
        </pre>

        <form onSubmit={handleAddRule} className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Soil"
            value={newRule.soil}
            onChange={(e) => setNewRule({ ...newRule, soil: e.target.value })}
            className="border p-1 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Season"
            value={newRule.season}
            onChange={(e) => setNewRule({ ...newRule, season: e.target.value })}
            className="border p-1 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Crop"
            value={newRule.crop}
            onChange={(e) => setNewRule({ ...newRule, crop: e.target.value })}
            className="border p-1 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Fertilizer"
            value={newRule.fertilizer}
            onChange={(e) =>
              setNewRule({ ...newRule, fertilizer: e.target.value })
            }
            className="border p-1 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Water (optional)"
            value={newRule.water}
            onChange={(e) => setNewRule({ ...newRule, water: e.target.value })}
            className="border p-1 rounded w-full"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Rule
          </button>
        </form>
      </section>
    </div>
  );
}

export default AdminDashboard;

import React, { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/history", {
          headers: { Authorization: token },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return <p className="text-center text-gray-600">⏳ Loading history...</p>;
  }

  if (history.length === 0) {
    return (
      <p className="text-center text-gray-600">
        📭 No advisory history available yet.
      </p>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        📜 My Advisory History
      </h2>
      <ul className="space-y-3">
        {history.map((item, index) => (
          <li
            key={index}
            className="border border-gray-300 p-4 rounded-lg shadow-sm"
          >
            <p>
              <strong>Soil:</strong> {item.soil}
            </p>
            <p>
              <strong>Season:</strong> {item.season}
            </p>
            <p>
              <strong>Water:</strong> {item.water || "Not specified"}
            </p>
            <p>
              <strong>Recommendation:</strong> {item.recommendation}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong>{" "}
              {new Date(item.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;

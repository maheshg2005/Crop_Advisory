import React, { useState } from "react";
import InputForm from "./InputForm";
import Result from "./Result";

function FarmerDashboard({ user, onLogout }) {
  const [result, setResult] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-green-700">Welcome, {user} 👨‍🌾</h2>
      <InputForm setResult={setResult} />
      {result && <Result result={result} />}
      <button onClick={onLogout} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
    </div>
  );
}

export default FarmerDashboard;

import React, { useState } from "react";

function InputForm({ setResult }) {
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [water, setWater] = useState("");
  const [climate, setClimate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soil, season, water, climate }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || "Error fetching recommendation");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Soil Type
        </label>
        <select
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">-- Select Soil --</option>
          <option value="black">Black</option>
          <option value="loamy">Loamy</option>
          <option value="alluvial">Alluvial</option>
          <option value="red">Red</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Season
        </label>
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">-- Select Season --</option>
          <option value="kharif">Kharif</option>
          <option value="rabi">Rabi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Water Availability
        </label>
        <select
          value={water}
          onChange={(e) => setWater(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select Water --</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Climate
        </label>
        <select
          value={climate}
          onChange={(e) => setClimate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">-- Select Climate --</option>
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
          <option value="moderate">Moderate</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        🌱 Get Advisory
      </button>
    </form>
  );
}

export default InputForm;

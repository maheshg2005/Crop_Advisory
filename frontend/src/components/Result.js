// frontend/src/components/Result.js
import React from "react";

function Result({ result }) {
  if (!result) return null;

  // Handle error from backend
  if (result.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
        ❌ {result.error}
      </div>
    );
  }

  // If backend sent an array, display multiple recommendations
  const recommendations = Array.isArray(result) ? result : [result];

  return (
    <div className="p-6 bg-green-50 border border-green-300 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">
        🌱 Crop Recommendations
      </h3>

      {recommendations.length === 0 ? (
        <p className="text-gray-700">⚠️ No suitable crops found for given inputs.</p>
      ) : (
        <ul className="space-y-4">
          {recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-green-700">
                🌾 {rec.crop}
              </h4>
              <p className="text-gray-700">
                <strong>Fertilizer:</strong> {rec.fertilizer}
              </p>
              <p className="text-gray-700">
                <strong>Water:</strong> {rec.water}
              </p>
              <p className="text-gray-700">
                <strong>Climate:</strong> {rec.climate || rec.weather || "Any"}
              </p>
              {rec.reason && (
                <p className="text-gray-600 italic mt-2">💡 {rec.reason}</p>
              )}
              {rec.climateAdvice && (
                <p className="text-blue-700 mt-2">☀️ {rec.climateAdvice}</p>
              )}
              {rec.notes && (
                <p className="text-purple-700 mt-2">📌 {rec.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Result;

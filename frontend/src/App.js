import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import InputForm from "./components/InputForm";
import Result from "./components/Result";
import AdminDashboard from "./components/AdminDashboard";
import History from "./components/History";

function App() {
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setResult(null);
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-500 flex flex-col">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">🌱 Smart Crop Advisory</h1>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
                className="bg-white text-green-700 px-3 py-1 rounded shadow hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
                className="bg-yellow-400 text-green-900 px-3 py-1 rounded shadow hover:bg-yellow-300"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        {!user ? (
          <>
            {/* Guest Dashboard */}
            {!showLogin && !showRegister && (
              <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6 w-full">
                <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
                  🌾 Try Advisory Dashboard
                </h2>
                <InputForm setResult={setResult} />
                {result && (
                  <div className="mt-6">
                    <Result result={result} />
                  </div>
                )}
                <p className="mt-4 text-sm text-center text-gray-600">
                  👉 Register/Login to save your advisory and view history
                </p>
              </div>
            )}

            {/* Show Auth Forms */}
            {(showLogin || showRegister) && (
              <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md mt-6">
                {showLogin && <Login setUser={setUser} />}
                {showRegister && <Register />}
              </div>
            )}
          </>
        ) : user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6 w-full">
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Welcome, {user.name} 👨‍🌾
            </h2>
            <InputForm setResult={setResult} />
            {result && result !== "history" && (
              <div className="mt-6">
                <Result result={result} />
              </div>
            )}
            <button
              onClick={() => setResult("history")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              📜 View My History
            </button>
            {result === "history" && (
              <div className="mt-6">
                <History />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4 text-center text-sm">
        © 2025 Smart Crop Advisory | Built with ❤️ for Farmers
      </footer>
    </div>
  );
}

export default App;

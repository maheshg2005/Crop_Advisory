const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Database Connection
const db = mysql.createConnection({
  host: "127.0.0.1",   // ✅ Forces IPv4, avoids ::1 issues
  user: "root",
  password: "",        // put password if you set one in MySQL
  database: "crop_advisory",
  port: 3306           // ✅ Explicitly set the port
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

// ---------------------------------------------------
// 🔹 Middleware
// ---------------------------------------------------
function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
}

// ---------------------------------------------------
// 🔹 Auth Routes
// ---------------------------------------------------
app.post("/api/register", async (req, res) => {
  const { name, email, password, soil, water, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, soil, water, role) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, soil || null, water || null, role || "farmer"],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully" });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
});

// ---------------------------------------------------
// 🔹 Advisory Routes
// ---------------------------------------------------
app.post("/api/recommend", (req, res) => {
  const { soil, season, water, climate } = req.body;

  if (!soil || !season || !climate) {
    return res.status(400).json({ error: "Soil, season and climate are required" });
  }

  const rulesPath = path.join(__dirname, "data", "rules.json");
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  const recommendations = rules[soil]?.[season] || [];

  // ✅ Filter by water (optional)
  const filtered = recommendations.filter((rec) => {
    let ok = true;

    if (rec.water && water) {
      ok = ok && rec.water.toLowerCase() === water.toLowerCase();
    }

    // No need for "rec.weather" because rules.json now has climateAdvice (textual info)
    return ok;
  });

  const result = filtered.map((r) => ({
    crop: r.crop,
    fertilizer: r.fertilizer,
    water: r.water || "general",
    climateAdvice: r.climateAdvice || "Suitable for general climate conditions.",
    notes: r.notes || "",
    reason: `Best for ${soil} soil in ${season} season with ${water || "any"} water.`
  }));

  res.json(result);
});

app.post("/api/saveAdvisory", authenticate, (req, res) => {
  const { soil, water, season, climate, recommendation } = req.body;

  db.query(
    "INSERT INTO advisories (user_id, soil, water, season, climate, recommendation) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.id, soil, water, season, climate, JSON.stringify(recommendation)],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Advisory saved successfully" });
    }
  );
});

app.get("/api/history", authenticate, (req, res) => {
  db.query("SELECT * FROM advisories WHERE user_id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ---------------------------------------------------
// 🔹 Admin Routes
// ---------------------------------------------------
app.get("/api/admin/users", authenticate, isAdmin, (req, res) => {
  db.query("SELECT id, name, email, role, soil, water FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/api/admin/advisories", authenticate, isAdmin, (req, res) => {
  db.query("SELECT * FROM advisories", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/api/admin/rules", authenticate, isAdmin, (req, res) => {
  const rulesPath = path.join(__dirname, "data", "rules.json");
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));
  res.json(rules);
});

app.post("/api/admin/rules", authenticate, isAdmin, (req, res) => {
  const { soil, season, crop, fertilizer, water, climateAdvice, notes } = req.body;
  const rulesPath = path.join(__dirname, "data", "rules.json");
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  if (!rules[soil]) rules[soil] = {};
  if (!rules[soil][season]) rules[soil][season] = [];

  rules[soil][season].push({ crop, fertilizer, water, climateAdvice, notes });
  fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2));

  res.json({ message: "Rule added successfully" });
});

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); // Add bcrypt dependency
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 54321;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Ensure this is set in .env

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
    res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  const { email, password, name, hostel, roomNumber, whatsappNumber } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Email, password, and name are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, hostel, roomNumber, whatsappNumber },
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
    res.json({ success: true, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

// User data endpoint (unchanged for brevity)
app.get("/api/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, hostel: user.hostel, roomNumber: user.roomNumber, whatsappNumber: user.whatsappNumber } });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("SIGINT received. Shutting down gracefully");
  process.exit(0);
});
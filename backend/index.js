const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => res.json({ message: "API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;

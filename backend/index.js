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
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

connectDB().catch(err => console.error('DB error:', err));

app.get("/", (req, res) => res.json({ message: "API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;

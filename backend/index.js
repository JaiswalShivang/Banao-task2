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
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!", status: "OK" });
});

app.get("/api", (req, res) => {
  res.json({ message: "API endpoint", status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

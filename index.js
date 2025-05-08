require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("./src/routes/adminRoutes");
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();

app.use(express.json());

// Mount routes
app.use("/api", adminRoutes);
app.use("/api", studentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Financial Learning App!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ message: err.message });
});

// Connect to MongoDB and start server
const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });

module.exports = app;

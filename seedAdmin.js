const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/userModel");

mongoose.connect("mongodb://localhost:27017/financialApp");

(async () => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create the admin user
    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    mongoose.connection.close();
  }
})();

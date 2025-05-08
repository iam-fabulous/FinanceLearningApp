const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("./userService");

class AuthService {
  generateAuthToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    if (secret === "your_jwt_secret") {
      console.warn(
        "Using default JWT secret. Set JWT_SECRET in environment variables for security."
      );
    }
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password must be non-empty strings");
    }

    const user = await UserService.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateAuthToken(user);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(token) {
    if (!token) {
      throw new Error("No token provided");
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return { message: "Logged out successfully" };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

module.exports = new AuthService();

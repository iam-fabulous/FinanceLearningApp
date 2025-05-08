const AuthService = require("../services/authService");

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid credentials"
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (error.message.includes("must be a non-empty string")) {
        return res.status(400).json({ message: error.message });
      }
      if (
        error.message === "JWT_SECRET is not defined in environment variables"
      ) {
        return res.status(500).json({ message: "Server configuration error" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      const result = await AuthService.logout(token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new AuthController();

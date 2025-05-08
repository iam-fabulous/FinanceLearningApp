const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthService = require("../../services/authService");
const UserService = require("../../services/userService");

jest.mock("../../services/userService");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Mock process.env to control environment variables
beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test_secret_key";
  process.env.JWT_EXPIRY = "2h";
});

afterEach(() => {
  delete process.env.JWT_SECRET;
  delete process.env.JWT_EXPIRY;
});

describe("Auth Service", () => {
  it("should login successfully with admin user", async () => {
    const mockUser = {
      _id: "1",
      username: "admin",
      email: "admin@example.com",
      password: "hashedPassword",
      role: "admin",
    };

    const mockToken = "mockJwtToken";
    UserService.findUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    const result = await AuthService.login("admin@example.com", "password123");

    expect(result).toEqual({
      token: mockToken,
      user: {
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
    expect(UserService.findUserByEmail).toHaveBeenCalledWith(
      "admin@example.com"
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id, email: mockUser.email, role: mockUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  });

  it("should throw error for invalid credentials", async () => {
    const mockUser = {
      _id: "1",
      username: "admin",
      email: "admin@example.com",
      password: "hashedPassword",
      role: "admin",
    };

    UserService.findUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      AuthService.login("admin@example.com", "wrongpassword")
    ).rejects.toThrow("Invalid credentials");
    expect(UserService.findUserByEmail).toHaveBeenCalledWith(
      "admin@example.com"
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongpassword",
      mockUser.password
    );
  });

  it("should throw error if JWT_SECRET is missing", async () => {
    delete process.env.JWT_SECRET;

    const mockUser = {
      _id: "1",
      username: "admin",
      email: "admin@example.com",
      password: "hashedPassword",
      role: "admin",
    };

    UserService.findUserByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    await expect(
      AuthService.login("admin@example.com", "password123")
    ).rejects.toThrow("JWT_SECRET is not defined in environment variables");
    expect(UserService.findUserByEmail).toHaveBeenCalledWith(
      "admin@example.com"
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      mockUser.password
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should logout successfully with valid token", async () => {
    const mockToken = "validToken";
    jwt.verify.mockReturnValue({});

    const result = await AuthService.logout(mockToken);

    expect(result).toEqual({ message: "Logged out successfully" });
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
  });

  it("should throw error for invalid token", async () => {
    const mockToken = "invalidToken";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(AuthService.logout(mockToken)).rejects.toThrow(
      "Invalid token"
    );
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
  });

  it("should throw error for missing token", async () => {
    await expect(AuthService.logout()).rejects.toThrow("No token provided");
    expect(jwt.verify).not.toHaveBeenCalled();
  });
});

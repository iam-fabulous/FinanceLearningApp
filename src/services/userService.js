const userRepo = require("../repositories/userRepo");

class UserService {
  async findUserByEmail(email) {
    if (!email || typeof email !== "string" || email.trim() === "") {
      throw new Error("Email must be a non-empty string");
    }
    const user = await userRepo.findUserByEmail(email.trim());
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async findUserById(id) {
    if (!id) {
      throw new Error("User ID is required");
    }
    const user = await userRepo.findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(userData) {
    if (
      !userData.email ||
      typeof userData.email !== "string" ||
      userData.email.trim() === ""
    ) {
      throw new Error("Email must be a non-empty string");
    }
    if (
      !userData.password ||
      typeof userData.password !== "string" ||
      userData.password.trim() === ""
    ) {
      throw new Error("Password must be a non-empty string");
    }
    if (!userData.role || !["admin", "student"].includes(userData.role)) {
      throw new Error('Role must be either "admin" or "student"');
    }
    try {
      return await userRepo.createUser(userData);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("User with this email already exists");
      }
      throw new Error("Error creating user: " + error.message);
    }
  }

  async updateUser(id, updateData) {
    await this.findUserById(id); // Ensure user exists
    if (
      updateData.email &&
      (typeof updateData.email !== "string" || updateData.email.trim() === "")
    ) {
      throw new Error("Email must be a non-empty string");
    }
    if (
      updateData.password &&
      (typeof updateData.password !== "string" ||
        updateData.password.trim() === "")
    ) {
      throw new Error("Password must be a non-empty string");
    }
    if (updateData.role && !["admin", "student"].includes(updateData.role)) {
      throw new Error('Role must be either "admin" or "student"');
    }
    try {
      const updatedUser = await userRepo.updateUser(id, updateData);
      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("User with this email already exists");
      }
      throw new Error("Error updating user: " + error.message);
    }
  }
}

module.exports = new UserService();

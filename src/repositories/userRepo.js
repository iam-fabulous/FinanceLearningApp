const User = require("../models/userModel");

class UserRepository {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new UserRepository();

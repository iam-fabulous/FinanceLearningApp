const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");
const CourseService = require("../services/courseService");
const TopicService = require("../services/topicService");
const StudentRequestDto = require("../dtos/request/studentRequestDto");
const StudentResponseDto = require("../dtos/response/studentResponseDto");
const CourseResponseDto = require("../dtos/response/courseResponseDto");
const TopicResponseDto = require("../dtos/response/topicResponseDto");

class StudentController {
  // Helper method to generate JWT token
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

  async enroll(req, res) {
    try {
      const requestDto = new StudentRequestDto(req.body);
      try {
        await UserService.findUserByEmail(requestDto.email);
        return res.status(400).json({ message: "User already exists" });
      } catch (error) {
        if (error.message !== "User not found") {
          throw error; // Re-throw unexpected errors
        }
        // User not found, proceed with enrollment
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(requestDto.password, salt);

      const user = await UserService.createUser({
        email: requestDto.email,
        password: hashedPassword,
        role: "student",
        enrolledCourses: [],
      });

      const token = this.generateAuthToken(user);

      res.status(201).json({
        token,
        user: new StudentResponseDto(user),
      });
    } catch (error) {
      if (error.message.includes("must be a non-empty string")) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "User with this email already exists") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async login(req, res) {
    try {
      const requestDto = new StudentRequestDto(req.body);
      const user = await UserService.findUserByEmail(requestDto.email);
      if (user.role !== "student") {
        return res.status(403).json({ message: "Only students can log in" });
      }

      const isMatch = await bcrypt.compare(requestDto.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = this.generateAuthToken(user);

      res.status(200).json({
        token,
        user: new StudentResponseDto(user),
      });
    } catch (error) {
      if (error.message.includes("must be a non-empty string")) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "User not found") {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getCourses(req, res) {
    try {
      const courses = await CourseService.findAllCourses();
      res
        .status(200)
        .json(courses.map((course) => new CourseResponseDto(course)));
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getAvailableTopics(req, res) {
    try {
      const topics = await TopicService.findTopicsByCourse(
        req.params.id,
        req.user.id
      );
      res.status(200).json(topics.map((topic) => new TopicResponseDto(topic)));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async enrollInCourse(req, res) {
    try {
      const course = await CourseService.findCourseById(req.params.id);
      const user = await UserService.findUserById(req.user.id);
      if (user.enrolledCourses.includes(course._id)) {
        return res
          .status(400)
          .json({ message: "Already enrolled in this course" });
      }
      user.enrolledCourses.push(course._id);
      const updatedUser = await UserService.updateUser(req.user.id, {
        enrolledCourses: user.enrolledCourses,
      });
      res.status(200).json(new StudentResponseDto(updatedUser));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new StudentController();

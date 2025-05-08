const courseRepo = require("../repositories/courseRepo");

class CourseService {
  async createCourse(data) {
    try {
      const courseExists = await courseRepo.findCourseByTitle(data.title);
      if (courseExists) {
        throw new Error("Course with this title already exists");
      }
      return await courseRepo.createCourse(data);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Course with this title already exists");
      }
      throw new Error("Error creating course: " + error.message);
    }
  }

  async updateCourse(id, data) {
    try {
      const course = await this.findCourseById(id);
      if (
        data.title &&
        (typeof data.title !== "string" || data.title.trim() === "")
      ) {
        throw new Error("Title must be a non-empty string");
      }
      if (
        data.description &&
        (typeof data.description !== "string" || data.description.trim() === "")
      ) {
        throw new Error("Description must be a non-empty string");
      }
      const updateData = {};
      if (data.title) updateData.title = data.title.trim();
      if (data.description) updateData.description = data.description.trim();
      return await courseRepo.updateCourse(id, updateData);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Course with this title already exists");
      }
      throw new Error("Error updating course: " + error.message);
    }
  }

  async deleteCourse(id) {
    const course = await this.findCourseById(id);
    return await courseRepo.deleteCourse(id);
  }

  async findCourseById(id) {
    if (!id) {
      throw new Error("Course ID is required");
    }
    const course = await courseRepo.findCourseById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  async findAllCourses() {
    try {
      return await courseRepo.findAllCourses();
    } catch (error) {
      throw new Error("Error fetching courses: " + error.message);
    }
  }
}

module.exports = new CourseService();

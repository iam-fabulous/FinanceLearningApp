const Course = require("../models/courseModel");

exports.createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

exports.updateCourse = async (id, updateData) => {
  return await Course.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

exports.findCourseById = async (id) => {
  return await Course.findById(id).populate("topics");
};

exports.findCourseByTitle = async (title) => {
  return await Course.findOne({ title }).populate("topics");
};

exports.findAllCourses = async () => {
  return await Course.find().populate("topics");
};

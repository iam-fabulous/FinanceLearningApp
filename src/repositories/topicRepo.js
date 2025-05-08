const Topic = require("../models/topicModel");
const Course = require("../models/courseModel");

class TopicRepository {
  async findOne(query) {
    return await Topic.findOne(query);
  }

  async createTopic(data) {
    const topic = new Topic(data);
    return await topic.save();
  }

  async findTopicByTitle(title) {
    return await Topic.find({ title: { $regex: title, $options: "i" } });
  }

  async findTopicById(id) {
    return await Topic.findById(id);
  }

  async updateTopic(id, data) {
    return await Topic.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTopic(id) {
    return await Topic.findByIdAndDelete(id);
  }

  async findAllTopics() {
    return await Topic.find().sort({ createdAt: -1 });
  }

  async findTopicsByCourse(courseId) {
    return await Topic.find({ courseId });
  }

  async addTopicToCourse(courseId, topicId) {
    return await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: { topics: topicId },
      },
      { new: true }
    );
  }
  async takeTopic(topicId, studentId) {
    return await Topic.findByIdAndUpdate(
      topicId,
      { $addToSet: { takenBy: studentId } },
      { new: true }
    );
  }

  async removeTopicFromCourse(courseId, topicId) {
    return await course.findByIdAndUpdate(
      courseId,
      {
        $pull: { topics: topicId },
      },
      { new: true }
    );
  }
}

module.exports = new TopicRepository();

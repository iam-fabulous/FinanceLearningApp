const topicRepo = require("../repositories/topicRepo");
const CourseService = require("./courseService");

class TopicService {
  async createTopic(courseId, data) {
    if (
      !data.title ||
      typeof data.title !== "string" ||
      data.title.trim() === ""
    ) {
      throw new Error("Title is required");
    }
    try {
      await CourseService.findCourseById(courseId); // Ensure course exists
      const existingTopic = await topicRepo.findOne({
        title: data.title,
        course: courseId,
      });
      if (existingTopic) {
        throw new Error("Topic with this title already exists");
      }
      const topicData = { ...data, courseId };
      const topic = await topicRepo.createTopic(topicData);
      await topicRepo.addTopicToCourse(courseId, topic._id);
      return topic;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Topic with this title already exists");
      }
      throw new Error("Error creating topic: " + error.message);
    }
  }

  async updateTopic(id, data) {
    try {
      const topic = await this.findTopicById(id);
      if (
        data.title &&
        (typeof data.title !== "string" || data.title.trim() === "")
      ) {
        throw new Error("Title must be a non-empty string");
      }
      if (
        data.content &&
        (typeof data.content !== "string" || data.content.trim() === "")
      ) {
        throw new Error("Content must be a non-empty string");
      }
      const updateData = {};
      if (data.title) updateData.title = data.title.trim();
      if (data.content) updateData.content = data.content.trim();
      const updatedTopic = await topicRepo.updateTopic(id, updateData);
      return updatedTopic;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Topic with this title already exists");
      }
      throw new Error("Error updating topic: " + error.message);
    }
  }

  async deleteTopic(id) {
    const topic = await this.findTopicById(id);
    const courseId = topic.courseId;
    await topicRepo.removeTopicFromCourse(courseId, id);
    return await topicRepo.deleteTopic(id);
  }

  async findTopicById(id) {
    if (!id) {
      throw new Error("Topic ID is required");
    }
    const topic = await topicRepo.findTopicById(id);
    if (!topic) {
      throw new Error("Topic not found");
    }
    return topic;
  }

  async findTopicsByCourse(courseId, userId = null) {
    try {
      await CourseService.findCourseById(courseId);
      const topics = await topicRepo.findTopicsByCourse(courseId);
      if (userId) {
        return topics.filter((topic) => !topic.takenBy.includes(userId));
      }
      return topics;
    } catch (error) {
      throw new Error("Error fetching topics: " + error.message);
    }
  }

  async takeTopic(topicId, userId) {
    const topic = await this.findTopicById(topicId);
    if (topic.takenBy.includes(userId)) {
      throw new Error("Topic already taken");
    }
    topic.takenBy.push(userId);
    return await topicRepo.updateTopic(topicId, { takenBy: topic.takenBy });
  }
}

module.exports = new TopicService();

const TopicService = require("../../services/topicService");
const topicRepo = require("../../repositories/topicRepo");
const CourseService = require("../../services/courseService");

jest.mock("../../repositories/topicRepo");
jest.mock("../../services/courseService");

describe("Topic Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a topic successfully", async () => {
    const mockCourseId = "course123";
    const mockTopicData = {
      title: "Budgeting Basics",
      content: "Learn how to budget.",
      takenBy: [],
    };
    const mockSavedTopic = {
      _id: "topic123",
      ...mockTopicData,
      courseId: mockCourseId,
    };

    CourseService.findCourseById.mockResolvedValue({ _id: mockCourseId });
    topicRepo.findOne.mockResolvedValue(null); // No duplicate
    topicRepo.createTopic.mockResolvedValue(mockSavedTopic);
    topicRepo.addTopicToCourse.mockResolvedValue();

    const result = await TopicService.createTopic(mockCourseId, mockTopicData);

    expect(result).toEqual(mockSavedTopic);
    expect(CourseService.findCourseById).toHaveBeenCalledWith(mockCourseId);
    expect(topicRepo.findOne).toHaveBeenCalledWith({
      title: mockTopicData.title,
      course: mockCourseId,
    });
    expect(topicRepo.createTopic).toHaveBeenCalledWith({
      ...mockTopicData,
      courseId: mockCourseId,
    });
    expect(topicRepo.addTopicToCourse).toHaveBeenCalledWith(
      mockCourseId,
      mockSavedTopic._id
    );
  });

  it("should throw error if course not found", async () => {
    const mockCourseId = "course123";
    const mockTopicData = {
      title: "Budgeting Basics",
      content: "Learn how to budget.",
    };

    CourseService.findCourseById.mockRejectedValue(
      new Error("Course not found")
    );

    await expect(
      TopicService.createTopic(mockCourseId, mockTopicData)
    ).rejects.toThrow("Error creating topic: Course not found");
    expect(CourseService.findCourseById).toHaveBeenCalledWith(mockCourseId);
  });

  it("should throw error if topic already exists", async () => {
    const mockCourseId = "course123";
    const mockTopicData = {
      title: "Budgeting Basics",
      content: "Learn how to budget.",
    };
    const mockExistingTopic = {
      title: "Budgeting Basics",
      course: mockCourseId,
    };

    CourseService.findCourseById.mockResolvedValue({ _id: mockCourseId });
    topicRepo.findOne.mockResolvedValue(mockExistingTopic);

    await expect(
      TopicService.createTopic(mockCourseId, mockTopicData)
    ).rejects.toThrow("Topic with this title already exists");
    expect(CourseService.findCourseById).toHaveBeenCalledWith(mockCourseId);
    expect(topicRepo.findOne).toHaveBeenCalledWith({
      title: mockTopicData.title,
      course: mockCourseId,
    });
  });

  it("should throw error for duplicate key error (MongoDB 11000)", async () => {
    const mockCourseId = "course123";
    const mockTopicData = {
      title: "Budgeting Basics",
      content: "Learn how to budget.",
    };

    CourseService.findCourseById.mockResolvedValue({ _id: mockCourseId });
    topicRepo.findOne.mockResolvedValue(null);
    topicRepo.createTopic.mockRejectedValue({ code: 11000 });

    await expect(
      TopicService.createTopic(mockCourseId, mockTopicData)
    ).rejects.toThrow("Topic with this title already exists");
    expect(CourseService.findCourseById).toHaveBeenCalledWith(mockCourseId);
    expect(topicRepo.findOne).toHaveBeenCalledWith({
      title: mockTopicData.title,
      course: mockCourseId,
    });
    expect(topicRepo.createTopic).toHaveBeenCalledWith({
      ...mockTopicData,
      courseId: mockCourseId,
    });
  });

  it("should find a topic by ID", async () => {
    const mockTopicId = "topic123";
    const mockTopic = {
      _id: mockTopicId,
      title: "Budgeting Basics",
      content: "Learn how to budget.",
    };

    topicRepo.findTopicById.mockResolvedValue(mockTopic);

    const result = await TopicService.findTopicById(mockTopicId);

    expect(result).toEqual(mockTopic);
    expect(topicRepo.findTopicById).toHaveBeenCalledWith(mockTopicId);
  });

  it("should throw error if topic not found by ID", async () => {
    const mockTopicId = "topic123";

    topicRepo.findTopicById.mockResolvedValue(null);

    await expect(TopicService.findTopicById(mockTopicId)).rejects.toThrow(
      "Topic not found"
    );
    expect(topicRepo.findTopicById).toHaveBeenCalledWith(mockTopicId);
  });

  it("should throw for invalid input in createTopic", async () => {
    const mockCourseId = "course123";
    await expect(
      TopicService.createTopic(mockCourseId, { content: "Test" })
    ).rejects.toThrow("Title is required");
  });
});

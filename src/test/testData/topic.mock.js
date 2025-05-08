// test/testData/topic.mock.js

const mockTopicData = {
  title: "Test Topic",
  content: "This is a test topic.",
};

const mockTopic2 = {
  title: "Finance",
  content: "This is a topic about finance.",
};

const mockSavedTopics = [
  { _id: "123", ...mockTopicData },
  { _id: "456", ...mockTopic2 },
];

module.exports = {
  mockTopicData,
  mockTopic2,
  mockSavedTopics,
};

class TopicResponseDto {
  constructor(topic) {
    this.id = topic._id;
    this.title = topic.title;
    this.content = topic.content;
    this.takenBy = topic.takenBy;
    this.createdAt = topic.createdAt;
    this.updatedAt = topic.updatedAt;
  }
}

module.exports = TopicResponseDto;

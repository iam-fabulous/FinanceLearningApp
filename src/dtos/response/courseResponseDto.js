class CourseResponseDto {
  constructor(course) {
    this.id = course._id;
    this.title = course.title;
    this.description = course.description;
    this.topics = course.topics || [];
    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;
  }
}

module.exports = CourseResponseDto;

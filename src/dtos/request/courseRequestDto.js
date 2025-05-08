class CourseRequestDto {
  constructor({ title, description }) {
    if (!title || !description) {
      throw new Error("Title and description are required");
    }
    this.title = title;
    this.description = description;
  }
}

module.exports = CourseRequestDto;

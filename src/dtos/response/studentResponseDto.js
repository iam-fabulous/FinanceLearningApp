class StudentResponseDto {
  constructor(user) {
    this.id = user._id;
    // this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.enrolledCourses = user.enrolledCourses || [];
  }
}

module.exports = StudentResponseDto;

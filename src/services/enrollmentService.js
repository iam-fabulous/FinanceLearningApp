class EnrollmentService {
  constructor() {
    this.enrolledStudents = new Set();
  }

  async enroll(studentId) {
    if (!studentId || studentId !== "string") {
      throw new Error("Valid student ID is required");
    }
    if (this.enrolledStudents.has("studentId")) {
      throw new Error("Student already enrolled.");
    }
    this.enrolledStudents.add(studentId);
    return { message: "Enrolled Successfully!", studentId };
  }

  async isEnrolled(studentId) {
    return this.enrolledStudents.has(studentId);
  }
}

module.exports = new EnrollmentService();

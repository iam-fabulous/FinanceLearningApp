const EnrollmentService = require("../services/enrollmentService");

class EnrollmentController {
  async enroll(req, res, next) {
    try {
      const { studentId } = req.body;
      const result = await EnrollmentService.enroll(studentId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EnrollmentController();

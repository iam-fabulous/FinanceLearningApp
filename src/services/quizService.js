const quizRepo = require("../repositories/quizRepo");

exports.createQuiz = async (data) => {
  return await quizRepo.createQuiz(data);
};

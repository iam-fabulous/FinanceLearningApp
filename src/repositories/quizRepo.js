const Quiz = require("../models/quizModel");

exports.createQuiz = async (data) => {
  return await Quiz.create(data);
};

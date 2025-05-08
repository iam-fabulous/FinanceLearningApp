const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);

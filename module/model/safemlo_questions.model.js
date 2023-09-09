const { default: mongoose, Schema } = require("mongoose");
const { ObjectId } = require("mongodb");

const answerSchema = new Schema(
  {
    opt: String,
    answerBody: {
      type: String,
      trim: true,
    },
    isCorrectAnswer: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    question: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: String,
      required: [true, "Category Id is Required"],
    },
    answers: [answerSchema],
    solution: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ question: "text", solution: "text" });

// const AnswerOptions = mongoose.model("answers", answerSchema);
const SAFEMLO_QUESTION =
  mongoose.model.Question || mongoose.model("Question", questionSchema);
SAFEMLO_QUESTION.createIndexes();

module.exports = {
  SAFEMLO_QUESTION,
};

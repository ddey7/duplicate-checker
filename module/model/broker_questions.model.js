const { default: mongoose, Schema } = require("mongoose");

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
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category Id is Required"],
    },
    // subCategoryId: {
    //   type: String,
    //   default: "null",
    // },
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
const BROKER_QUESTIONS = mongoose.model("Broker_Question", questionSchema);
BROKER_QUESTIONS.createIndexes();

module.exports = {
  BROKER_QUESTIONS,
};

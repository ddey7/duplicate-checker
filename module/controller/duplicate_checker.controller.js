const stringSimilarity = require("string-similarity");
const mongoose = require("mongoose");
var broker_url = process.env.MONGO_BROKER_DB_URL;
var sales_url = process.env.MONGO_SALES_DB_URL;
var safemlo_url = process.env.MONGO_SAFEMLO_DB_URL;
const { SALES_QUESTION } = require("../model/sales_questions.model");
const { BROKER_QUESTIONS } = require("../model/broker_questions.model");
const { broker_verifyToken } = require("../services/broker_token.service");
const { sales_verifyToken } = require("../services/sales_token.service");
const { safemlo_verifyToken } = require("../services/safemlo_token.service");
const { SAFEMLO_QUESTION } = require("../model/safemlo_questions.model");

async function getQuestions(exam_type) {
  try {
    const collectionMapping = {
      broker: BROKER_QUESTIONS,
      salesperson: SALES_QUESTION,
      safemlo: SAFEMLO_QUESTION,
    };

    const db_url = collectionMapping[exam_type];
    if (!db_url) {
      throw new Error("Invalid exam type");
    }

    mongoose.set("strictQuery", false);
    await mongoose.connect(db_url);

    const QuestionCollection = await collectionMapping[exam_type].find({});

    return QuestionCollection;
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
}

class DuplicateChecker {
  async calculateDuplicate(req, res) {
    const { exam_type } = req.params;

    const verifyTokenFunctions = {
      broker: broker_verifyToken,
      salesperson: sales_verifyToken,
      safemlo: safemlo_verifyToken,
    };

    const verifyToken =
      verifyTokenFunctions[exam_type] || (() => ({ isVerified: false }));
    const verifiedToken = verifyToken(req);

    if (verifiedToken.isVerified) {
      try {
        let questionArray = await getQuestions(exam_type);

        if (questionArray.length == 0)
          res.status(404).json({ message: "No Data Found" });

        let almostDuplicate = {
          totalData: 0,
          data: [],
        };

        for (let i = 0; i < questionArray.length; i++) {
          let data = {};
          const element1 = questionArray[i].question;
          const element1Id = questionArray[i]._id;
          let removeSpaceAndCharacters1 = element1
            .toLowerCase()
            .replace(/[^\w]/g, "");
          data[element1Id] = questionArray[i];

          for (let j = 0; j < questionArray.length; j++) {
            const element2 = questionArray[j].question;
            const element2Id = questionArray[j]._id;
            let removeSpaceAndCharacters2 = element2
              .toLowerCase()
              .replace(/[^\w]/g, "");

            if (element1Id !== element2Id) {
              let checkSimilarity = await stringSimilarity.compareTwoStrings(
                removeSpaceAndCharacters1,
                removeSpaceAndCharacters2
              );

              if (checkSimilarity > 0.85) {
                almostDuplicate.totalData = almostDuplicate.totalData + 1;
                data[element2Id] = questionArray[j];
              }
            }
          }
          let dataKeys = Object.keys(data);
          if (dataKeys.length > 1) {
            questionArray = questionArray.filter((items) => {
              if (dataKeys.includes(items._id.toString()) == false) {
                return items;
              }
            });
            almostDuplicate.data.push(data);
          }
        }
        res.status(200).json(almostDuplicate);
      } catch (error) {
        console.log(
          `🚀 ~ file: duplicate_checker.controller.js:120 ~ DuplicateChecker ~ calculateDuplicate ~ error:`,
          error
        );
        res.status(400).json({ error });
      }
    } else {
      res.status(401);
      res.json({
        message: "Permission Denied",
      });
    }
  }
}

module.exports = new DuplicateChecker();

const { Router } = require("express");
const duplicate_checkerController = require("../controller/duplicate_checker.controller");
const duplicateCheckerRouter = Router();

duplicateCheckerRouter.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Fcuk!!!! It Worked",
  });
});

duplicateCheckerRouter.post(
  "/:exam_type",
  duplicate_checkerController.calculateDuplicate
);

module.exports = { duplicateCheckerRouter };

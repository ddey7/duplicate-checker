require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SAFEMLO_SECRET_KEY;

//  cmnt: verify token after getting data
const safemlo_verifyToken = (req) => {
  let token = "";

  //  cmnt: check if method is get or post
  if (req.method == "GET") {
    //  cmnt: we sent the token via header or from the cookies saveed in the browser
    token = req.headers["x-auth-token"]
      ? req.headers["x-auth-token"]
      : req.cookies["mlo-admin"];
  } else {
    token = req.body.token;
  }

  //  cmnt: check if the token is available or not
  if (token) {
    try {
      const verifiedToken = jwt.verify(token, secretKey);

      return {
        isVerified: true,
        data: verifiedToken.data,
      };
    } catch (error) {
      console.log(`🚀 ~ file: safemlo_token.service.js:60 ~ error:`, error);

      return {
        isVerified: false,
        message: "Token FAILED",
      };
    }
  } else {
    return {
      isVerified: false,
      message: "Token Not Found",
    };
  }
};

module.exports = {
  safemlo_verifyToken,
};

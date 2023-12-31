require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.BROKER_SECRET_KEY;

// cmnt: generate a random token using post data and secret key
const createToken = async (req, expiresIn) => {
  const { body: formData, originalUrl: api } = req;

  const endpoint = req.get("origin") || `https://${req.get("host")}`;
  const iss = endpoint + api;
  const token = await jwt.sign(
    {
      iss: iss,
      data: formData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
  return token;
};

// cmnt: generate a custom token using password and the inserted id  and secret key
const createCustomToken = async (data, expiresIn) => {
  const { body: formData, originalUrl: api, endpoint: endpoint, iss } = data;
  const token = await jwt.sign(
    {
      iss: iss,
      data: formData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
  return token;
};

//  cmnt: verify token after getting data
const broker_verifyToken = (req) => {
  let token = "";

  //  cmnt: check if method is get or post
  if (req.method == "GET") {
    //  cmnt: we sent the token via header or from the cookies saveed in the browser
    token = req.headers["x-auth-token"]
      ? req.headers["x-auth-token"]
      : req.cookies["broker-admin"];
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
      console.log(`🚀 ~ file: broker_token.service.js:65 ~ error:`, error);
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
  createToken,
  broker_verifyToken,
  createCustomToken,
};

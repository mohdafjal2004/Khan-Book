var jwt = require("jsonwebtoken");
const JWT_SECRET = "AfjalTheBoss";

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  let token = req.header("auth-token");
  //Get the token from header named as auth-token so whenever we want to make any request where login is required , we will use auth-token
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;

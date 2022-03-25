const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "AfjalTheBoss";

//*ROUTE 1 :Create a user using POST "/api/auth/createuser" . No login required   //REGISTER USER API
router.post(
  "/createuser",
  [
    //validation layer during registration
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;

    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //check whether the user email already  exists
      var user = await User.findOne({ email: email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Sorry this email already exists" });
      }
      //Generating salt and applying to password of user during registration
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt); //password from frontend using req.body

      //create a new user
      user = await User.create({
        name: name,
        email: email,
        password: hashedpassword,
      });

      //Using token during signup after defining it  , here id of user is sent as token from server to client
      const data = {
        user: {
          id: user.id,
        },
      };

      //defining the token
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });

      // res.json(user);
    } catch (error) {
      //error handling while creating user
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//*ROUTE 2 : Authenticate a user using POST "/api/auth/loginuser" .No  login required  //LOGIN USER API
router.post(
  "/loginuser",
  [
    //validation layer during registration
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be Blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    //authentication starts
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login to with right credientials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login to with right credientials",
        });
      }
      //Using token during login after defining it  , here id of user is sent as token from server to client
      const data = {
        user: {
          id: user.id,
        },
      };

      //defining the token
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      return res.json({ success, authToken });

      //error handling while creating user
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured during login");
    }
  }
);

//*ROUTE 3 : Get Loggedin user details using POST "api/auth/login". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // var userId = req.user.id;
    const user = await User.findById(req.user.id).select("-password"); //Here we got all details(except password which we dont want to show) of a user from token using id
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured during fetching data");
  }
});

module.exports = router;

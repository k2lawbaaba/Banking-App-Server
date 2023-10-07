let { user } = require("../Models/mongooseSchema");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
require("dotenv").config();

const login = async (context, Username, password) => {
  let username = Username.toLowerCase();
  try {
    const isUser = await user.findOne({ Username: username });
    if (!isUser) return "Username doesn't exist";
    else {
      let passwordMatch = await bcrypt.compare(password, isUser.password);

      if (passwordMatch) {
        //create token
        let token = jwt.sign(
          { id: isUser._id, Username: isUser.Username },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
          console.log(token);
        context.res.cookie("userToken", JSON.stringify(token), {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
          secure:true,
          domain: "https://banking-app-ftov.onrender.com/"
         
        });
        return `Logged in successfully`;
      } else return "Invalid Username or password";
    }
  } catch (error) {
    console.log("Error Message", error);
    return "Failed to connect to the server";
  }
};
module.exports = login;

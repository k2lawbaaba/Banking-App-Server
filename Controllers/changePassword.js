const { user } = require("../Models/mongooseSchema");
const bcrypt = require("bcryptjs");

const changePassword = async (userId, oldPassword, newPassword) => { 

  try {
    const userExist = await user.findById({ _id: userId });
    // console.log(userExist);
    let verifyPassword = await bcrypt.compare(
      oldPassword,
      userExist.password
    );
    
    if (verifyPassword) {
      
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const passwordChanged = await user.findByIdAndUpdate(
        { _id: userId },
        { password: hashedPassword },
      );

      if(passwordChanged) 
    {  return( "Password changed successfully");}
      else 
     { return ("Failed to change Password")}
    } 
    else return "Current password is incorrect";
  } catch (error) {
    console.log(error);
  
  }
};
module.exports = changePassword;

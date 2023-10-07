const { user } = require("../Models/mongooseSchema");
const bcrypt = require("bcryptjs");

const changePIN = async (userId, oldPIN, newPIN) => {
  console.log(userId);

  try {
    const userExist = await user.findById({ _id: userId });
    // console.log(userExist);
    let verifyPIN = await bcrypt.compare(
      oldPIN,
      userExist.PIN
    );
    if (verifyPIN) {
      const salt = await bcrypt.genSalt();
      const hashedPIN = await bcrypt.hash(newPIN, salt);
      const PINChanged = await user.findByIdAndUpdate(
        { _id: userId },
        { PIN: hashedPIN }
      );
    if(PINChanged)  return( "PIN changed successfully");
    else return `Failed to update PIN`
    } else return ("PIN is incorrect");
  } catch (error) {
    console.log(error);
    return error.message;
  
  }
};
module.exports = changePIN;

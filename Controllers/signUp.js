const bcrypt = require("bcryptjs");
const { user } = require("../Models/mongooseSchema");
const errorHandler = require("../Services/handleError");
const nodeMailer = require("../Services/nodemailer");

const signUp = async (firstName, lastName, Username, PhoneNumber, Email, Password) => {
  

  try {
      const subject = `Account Opened Succeessfully`;
      const message = `                  
                    Greeting ${firstName}
                   
                    Your account has been successfully created.

                    Details:

                    Fullname :${firstName+ " " + lastName }
                    Account Number: ${PhoneNumber}
                    Current Balance: # 0.00
                    
                    Please login using your credentials to activate 
                    your account and start using our services.
                    
                    Best regards
                    The team at Abbay Banking Plc`;

        //  encypting the user password and default PIN of "0000"
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(Password, salt);
      const hashedPIN = await bcrypt.hash("0000", salt);


      let name = firstName + " " + lastName
    let isUsername= await user.findOne({Username:Username});

    if(isUsername) return `${Username.toUpperCase()} already exist`
    else{

    
      const AccountHolder = new user({
        name: name,
        Username: Username.toLowerCase(),
        email: Email.toLowerCase(),
        Phone: PhoneNumber,
        password: hashedPassword,
        PIN:hashedPIN,
        AccountNumber: PhoneNumber
      });
      let newUser = await AccountHolder.save();

      if(newUser){
        //  Automated email for successful signup by the user
        nodeMailer(Email, subject, message);
        
        return "Account created successfully";
    
      }
    }
  } catch (error) {
    // console.log(error);
    // // handling the database error
    const errors = errorHandler.dbSchemaErrors(error);
   
    return errors ;

  }
  // }
};
module.exports = signUp;

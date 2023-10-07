let { user, transaction } = require("../Models/mongooseSchema");
const nodeMailer = require("../Services/nodemailer");
const { Decimal } = require("decimal.js");

const withdraw = async (id, amount) => {
  try {
    //  retrieve the balance
    let account = await user.findById({ _id: id });
    if (account.Balance >= amount) {
      //Decimal is used to get precised figure
      let bal = new Decimal(account.Balance).minus(amount).toFixed(2);
      let acctNumber = account.AccountNumber;
      // console.log(bal);
      let date = new Date();
      const subject = `Abbay Bank Debit Alert`;
      const message = `Dear ${account.name} ,
        A Debit transaction just occurred on your account. Please see details below:
      	
            Transaction Amount      	-NGN ${amount}

            Account Number	            ****${acctNumber.slice(-4)}
            Account Name	            ${account.name.toUpperCase()}
            Transaction Type	        WITHDRAW
            Transaction Date & Time	    ${date.toLocaleString()}

            The balances on this account are

            Available Balance	NGN ${bal}
            `;

      // update the balance
      await user.findByIdAndUpdate(id, { $set: { Balance: bal } });

      // update the transaction
      const transact = new transaction({
        accountHolder: account.name,
        account: account.AccountNumber,
        typeOfTransaction: "WITHDRAW",
        Amount: amount,
        Date: new Date().toLocaleString(),
      });
      let withdrawTransact = await transact.save();

      //  Automated email for successful withdraw by the user
      withdrawTransact && nodeMailer(account.email, subject, message);

      return withdrawTransact && "Transaction successful";
    } else return `Insufficient fund`;
  } catch (error) {
    console.log(error);
  }
};
module.exports = withdraw;

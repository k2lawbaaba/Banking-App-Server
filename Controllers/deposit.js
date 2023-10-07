let { user, transaction } = require("../Models/mongooseSchema");
const nodeMailer = require("../Services/nodemailer");
const { Decimal } = require("decimal.js");

const deposit = async (id, amount) => {
  // console.log(id, amount);
  try {
    //  retrieve the balance
    let account = await user.findById({ _id: id });

    //Decimal is used to get precised figure
    let bal = new Decimal(account.Balance).add(amount).toFixed(2);
    //   console.log(bal)
    let acctNumber = account.AccountNumber;

    let date = new Date();
    const subject = `Abbay Bank Credit Alert`;
    const message = `Dear ${account.name},
        A Credit transaction just occurred on your account. Please see details below:
      	
            Transaction Amount      	+NGN ${amount}

            Account Number	            ****${acctNumber.slice(-4)}
            Account Name	            ${account.name.toUpperCase()}
            Transaction Type	        DEPOSIT
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
      typeOfTransaction: "DEPOSIT",
      Amount: amount,
      Date: new Date().toLocaleString(),
    });
    let saveTransact = await transact.save();

    //  Automated email for successful deposit by the user
    saveTransact && nodeMailer(account.email, subject, message);

    return saveTransact && "Transaction successful";
  } catch (error) {
    console.log(error);
  }
};
module.exports = deposit;

let { user, transaction } = require("../Models/mongooseSchema");

const transactionHistory = async (userId) => {


  try {
    // retrieve the account number
    let isUser = await user.findById({ _id: userId });
    let accountNo = isUser.AccountNumber;
    // fetching the transaction history for this account number
    let history = await transaction.find({
      $or: [{ account: accountNo }, { receiverAccount: accountNo }],
    }).sort({ createdAt: -1 }) //return the latest record;

    if (history) return history;
    else return `No transaction made`;
  } catch (error) {
    console.log(error);
  }
};
module.exports = transactionHistory;

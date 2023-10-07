const { user, transaction } = require("../Models/mongooseSchema");
const { Decimal } = require("decimal.js");
const nodeMailer = require("../Services/nodemailer");

const Transfer = async (userId, receiverAccount, amount, Narration) => {
  var senderBalance,
    receiverBalance = 0;
  let senderName, receiverName, senderAcctNo, senderEmail;
  try {
    const senderAccnt = await user.findById(
      { _id: userId },
      "name email Balance AccountNumber -_id"
    );

    senderBalance = senderAccnt.Balance;
    senderName = senderAccnt.name;
    senderAcctNo = senderAccnt.AccountNumber;
    senderEmail = senderAccnt.email;

    if(senderAcctNo === receiverAccount){
      return ('Cannot transfer to own account');
    }
    const recieverAcct = await user.findOne(
      { AccountNumber: receiverAccount },
      "name email Balance -_id"
    );
    if (recieverAcct) {
      // fetching the balance and name

      receiverName = recieverAcct.name;
      receiverBalance = recieverAcct.Balance;

      // deducting amount in account holder's bank
      if (senderBalance >= amount) {
        let senderBal = new Decimal(senderBalance).minus(amount).toFixed(2);
        let receiverBal = new Decimal(receiverBalance).add(amount).toFixed(2);

        // updating the sender and receiver balances
        await user.updateOne({ _id: userId }, { $set: { Balance: senderBal } });
        await user.updateOne(
          { AccountNumber: receiverAccount },
          { $set: { Balance: receiverBal } }
        );

        // creating automated message
        let date = new Date();

        // Sender's mail for debit
        const senderSubject = `Abbay Bank Debit Alert`;
        const senderMessage = `Dear ${senderName},
        A Debit transaction just occurred on your account. Please see details below:
      	
            Transaction Amount      	-NGN ${amount}

            Account Number	            ****${senderAcctNo.slice(-4)}
            Account Name	            ${senderName.toUpperCase()}
            Transaction Type	        TRANSFER
            Description                 ${Narration}
            Transaction Date & Time	    ${date.toLocaleTimeString()}
            Value Date	                ${date.toLocaleDateString()}

            The balances on this account are

            Available Balance	NGN ${senderBal}
            `;

        // Receiver's mail for account credit
        const receiverSubject = `Abbay Bank Credit Alert`;
        const receiverMessage = `Dear ${receiverName},
            A Credit transaction just occurred on your account. Please see details below:
              
                Transaction Amount      	-NGN ${amount}
    
                Account Number	            ****${receiverAccount.slice(-4)}
                Account Name	            ${receiverName.toUpperCase()}
                Transaction Type	        TRANSFER
                Description                 ${Narration}
                Transaction Date & Time	    ${date.toLocaleString()}
    
                The balances on this account are
    
                Available Balance	NGN ${receiverBal}
                `;
        //creating transaction collection
        const trans = new transaction({
          accountHolder: senderName,
          account: senderAcctNo,
          receiverName: receiverName,
          receiverAccount: receiverAccount,
          Amount: amount,
          typeOfTransaction: "TRANSFER",
          Narration: Narration,
          Date: new Date().toLocaleString(),
        });
        let saveTransaction = await trans.save();
        if (saveTransaction) {
          nodeMailer(senderAccnt.email, senderSubject, senderMessage);
          nodeMailer(recieverAcct.email, receiverSubject, receiverMessage);

          return `NGN${amount} was transferred successfully.`;
        }
      } else {
        return "Insufficient Balance";
      }
    } else return `Account ${receiverAccount} cannot be found`;
  } catch (error) {
    console.error(error);
  }
};

module.exports = Transfer;

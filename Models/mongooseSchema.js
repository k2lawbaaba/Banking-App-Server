let mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for user collection
const User = new Schema(
  {
    name: {
      type: String,
    },
    Username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    PIN: { type: String},
    Phone: {
      type: String,
      unique: true,
    },
    AccountNumber: String,
    Balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// // creating the account balance schema
// const balanceSchema = new Schema(
//   {
//     accountNumber: String,
//     Fullname: String,
//     Balance: Number,
//   },
//   { timestamps: true }
// );

//  creating the transaction schema

const transactionSchema = new Schema(
  {
    accountHolder: String,
    account: String,
    receiverName: String,
    receiverAccount: String,
    Amount: String,
    typeOfTransaction: String,
    Narration: String,
    Date: String,
  },
  { timestamps: true }
);
module.exports.user = mongoose.model("user", User);
// module.exports.Balance = mongoose.model("Balance", balanceSchema);
module.exports.transaction = mongoose.model("Transaction", transactionSchema);

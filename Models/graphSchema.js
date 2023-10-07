const graphql = require("graphql");
const bcrypt = require("bcryptjs");
const signUp = require("../Controllers/signUp");
const { user, transaction } = require("../Models/mongooseSchema");
const login = require("../Controllers/login");
const transfer = require("../Controllers/Transfer");
const deposit = require("../Controllers/deposit");
const withdraw = require("../Controllers/withdraw");
const transactionHistory = require("../Controllers/transactionHistory");
const logOut = require("../Controllers/logOut");
const changePassword = require("../Controllers/changePassword");
const changePIN = require("../Controllers/changePIN");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
  name: "AccountHolder",
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    Phone: { type: GraphQLString },
    AccountNumber: { type: GraphQLString },
    Balance: { type: GraphQLFloat },
  }),
});

const balanceType = new GraphQLObjectType({
  name: "balance",
  fields: () => ({
    Balance: { type: GraphQLFloat },
  }),
});

const TransactionType = new GraphQLObjectType({
  name: "Transaction",
  fields: () => ({
    id: { type: GraphQLString },
    account: { type: GraphQLString },
    accountHolder: { type: GraphQLString },
    receiverAccount: { type: GraphQLString },
    receiverName: { type: GraphQLString },
    Amount: { type: GraphQLFloat },
    Narration: { type: GraphQLString },
    typeOfTransaction:{type: GraphQLString},
    Date: { type: GraphQLString },
  }),
});

// Define a custom object type for the login, signup result
const MessageType = new GraphQLObjectType({
  name: "Feedback",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    Transaction: {
      type: new GraphQLList(TransactionType),
      args: {
        userId: { type: GraphQLString },
      },
      resolve(root, args) {
        return transactionHistory(args.userId);
      },
    },

    Account: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (obj, args) => {
        let userId = args.id;
      return user.findOne({ _id: userId });
        
      },
    },
    GetReceiverAccount: {
      type: UserType,
      args: {
        accountNum: { type: GraphQLString },
      },
      resolve: (obj, args) => {
        let accountNum = args.accountNum;
        const receiverAcct = user.findOne({ AccountNumber: accountNum });
        if(receiverAcct) return receiverAcct;
        else return "Account not found";
      },
    },
    LogOut: {
      type: MessageType,
      resolve: (roots, args,context) => {
         return { message: logOut(context) };
      },
    },
  },
});

// populating the collection
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: {
      type: MessageType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        Username: { type: GraphQLString },
        Email: { type: GraphQLString },
        PhoneNumber: { type: GraphQLString },
        Password: { type: GraphQLString },
      },
      resolve: async (roots, args) => {
        const { firstName, lastName, Username, PhoneNumber, Email, Password } =
          args;
        return {
          message: signUp(
            firstName,
            lastName,
            Username,
            PhoneNumber,
            Email,
            Password
          ),
        };
      },
    },
// login query
    Login: {
      type: MessageType,
      args: {
        Username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (roots, args, context) => {
        const { Username, password } = args;
        return { message: login(context, Username, password) };
      },
    },
    // Deposit operation query
    Deposit: {
      type: MessageType,
      args: {
        userId: { type: GraphQLString },
        amount: { type: GraphQLFloat },
      },
      resolve: (roots, args) => {
        let userId = args.userId;
        return { message: deposit(userId, args.amount) };
      },
    },
// withdrawal operation query
    Withdraw: {
      type: MessageType,
      args: {
        userId: { type: GraphQLString },
        amount: { type: GraphQLFloat },
      },
      resolve: (roots, args) => {
        let userId = args.userId;
        return { message: withdraw(userId, args.amount) };
      },
    },
// Transfer operation query
    Transfer: {
      type: MessageType,
      args: {
        userId: { type: GraphQLString },
        receiverAccount: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        Narration: { type: GraphQLString },
      },
      resolve: async (roots, args) => {
        let { receiverAccount, amount, Narration } = args;
        let userID = args.userId;

        return {
          message: transfer(userID, receiverAccount, amount, Narration),
        };
      },
    },

    // update Password
    ChangePassword:{
      type :MessageType ,
      args: {
        userId:{type:GraphQLString},
        oldPassword:{type:GraphQLString},
        newPassword:{type:GraphQLString}
      },
      resolve(roots, args){
        
        return {message: changePassword(args.userId, args.oldPassword, args.newPassword)};
      }

    },
    // update PIN
    ChangePIN:{
      type :MessageType ,
      args: {
        userId:{type:GraphQLString},
        oldPIN:{type:GraphQLString},
        newPIN:{type:GraphQLString}
      },
      resolve(roots, args){
        return {message: changePIN(args.userId, args.oldPIN, args.newPIN)};
      }
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

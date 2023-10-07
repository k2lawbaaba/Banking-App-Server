var mongoose = require("mongoose");
require("dotenv").config();


let uri = process.env.ATLAS_DATABASE;

const connectMongoose = () => {
  mongoose.set('strictQuery', false);
  return mongoose
    .connect(uri)
    .then(() => {
      console.log(`Connected to the Atlas successfully`);
    })
    .catch((err) => {
      console.log(`Connection to the database failed ${err}`);
      process.exit(1);
    });
};

module.exports = connectMongoose;

const logOut = (context) => {

  context.res.cookie("userToken", "", { maxAge: 1 });
  return("Successfully logged out");
};
module.exports = logOut;

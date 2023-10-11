const exp = require("express");
const { graphqlHTTP } = require("express-graphql");
const myGraphQLSchema = require("./Models/graphSchema");
let ConnectMongoose = require("./Models/mongooseConnect");
let cors = require("cors");
const path = require("path");
let verifyToken = require("./Controllers/verifyToken");
let cookieParser = require("cookie-parser");
require('dotenv').config();


let PORT= process.env.PORT 
const app = exp();

const allowedURLS=["http://localhost:3000","http://localhost:4002","https://banking-app-ftov.onrender.com"]
// middlewares
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(cors({
  origin: allowedURLS,
  credentials: true,
  exposedHeaders: ['Set-Cookie', 'Date', 'ETag']
}));
app.use(verifyToken);
  
// app.use(exp.static(path.join(__dirname, './Client/build')));

// allow cross origin request

  app.use(
    "/graphql",
    
    graphqlHTTP((req, res, graphQLParams) => ({
      schema: myGraphQLSchema,
      graphiql: true,
      context: {
        user: req.user,
        res: res,
      email: req.email,
    },
    playground:true,
    cors: {
      credentials: true,
      origin: "*"
  }
  
  }))
  );
  
  // app.get("*",(req,res)=>{
    //   res.sendFile(path.join(__dirname,"./Client/build/index.html"))
    // })
  

  ConnectMongoose().then(()=>{
    console.log(`connected to database`);
    app.listen(PORT, ()=>{
      console.log(`server is running on port ${PORT}`);
    })
  }).catch((error=>{

    console.log(error)
  }))



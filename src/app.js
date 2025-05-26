const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();


// app.use("/", (err, req, res, next) => {

//   if(err){
//     res.status(401).send({
//       error: "Unauthorized access",
//       message: "You are not authorized to access this route",
//     });
//   }
// })

app.get("/user/getAllData", (req, res) =>{

  throw new Error("This is an error from the user route");
  res.send({ message: "user data send" })
})

app.use("/", (err, req, res, next) => {

  if(err){
    res.status(401).send({
      error: "Unauthorized access",
      message: "You are not authorized to access this route",
    });
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

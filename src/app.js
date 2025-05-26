const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth, userAuth );


app.get("/user", userAuth, (req, res,) => {
  res.send({
    message: "User data accessed successfully",
  });
  console.log("User accessed data");
})

app.get("/user/login", (req, res) => {
  res.send({
    message: "User logged in successfully",
  });
  console.log("User logged in");
}); 

app.get("/admin/getAllData", (req, res) => {
  res.send({
    users: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
    ],
  });
  console.log("Admin accessed all data");
});

app.get("/admin/deleteAllData", (req, res) => {
  res.send({
    message: "All data deleted successfully",
  });
  console.log("Admin deleted all data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

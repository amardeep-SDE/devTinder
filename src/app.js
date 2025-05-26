const express = require("express");

const app = express();

// app.use("/user", (req, res) => {
//     res.send("Hello, user!");
// })

app.get("/user", (req, res) => {
  res.send([{ name: "amardeep", age: 32 }, { name: "sachin", age: 30 }]);
});

app.post("/user", (req, res) => {
  res.send({ message: "User created successfully!" });
});
app.delete("/user", (req, res) => {
  res.send({ message: "User deleted successfully!" });
});
app.get("/user/:id", (req, res) => {
    console.log(req.params.id);
    
    const userId = req.params.id;
    res.send({ message: `User ID is ${userId}` });
})

app.use("/test", (req, res) => {
  res.send("Hello, test!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const express = require("express");

const app = express();

// app.use("/route", rH1, [rH2, rH3, rH4], rH5);

app.use(
  "/user",
  (req, res, next) => {
    // res.send("Hello, world 1!");
    console.log("handling the route user 1");
    next();
  },
  (req, res, next) => {
    console.log("handling the route user 2");
    // res.send("Hello, world 2!");
    next();
  },
  (req, res, next) => {
    console.log("handling the route user 3");
    // res.send("Hello, world 3!");
    next();
  },
  (req, res, next) => {
    console.log("handling the route user 4");
    res.send("Hello, world 4!");
    next();
  },
  (req, res, next) => {
    console.log("handling the route user 5");
    res.send("Hello, world 5!");
    // next();
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

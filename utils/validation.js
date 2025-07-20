const validator = require("validator");

const valiDateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough");
  }
}

const validateProfileEditData = (req) => {

  const allowedUpdates = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  // if (!isValidOperation) {
  //   throw new Error("Invalid updates!"); 
  // }
  if (req.body?.skills && req.body.skills.length > 5) {
    throw new Error("Skills array cannot exceed 5 items.");
  }
  return isValidOperation;

}
module.exports = {
  valiDateSignupData,
  validateProfileEditData
};
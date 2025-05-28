- Create a repository
- Initialize the repository
- node_modules, package.json, package-lock-json
- Install express
- Create a server
- Listen to port 7777
- Write request handler for /test, /hello
- Install nodemon and update scripts inside package.json
- What are dependencies
- what is the use of "-g" while npm install
- Difference between caret and tilde ( ^ vs ~)

- Initialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with routes and route extensions ex. /hello, /hello/2
- Order of the routes matter a lot
- Install Postman app and make a workspace/collection > test API call
- Write logic to handle GET, POST, PATCH and DELETE API calls and test them on postman
- Explore routing and use of ? , * , () in the routes
- Use of regex in routes /a/
- Reading the query params in the routes
- Reading the dynamic routes - /user/:id

- Multiple Route Handlers - play with the code
- next()
- next function and errors along with res.send()
- app.use("/route, rH, rH2, [rH3, rH4], rH5);

- What is Middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference between app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except user/login 

- Error Handling using app.use("/" , (err, req, res, next) = {});

- Create a free cluster on Mongodb  official website (Mongo Atlas)
- Install mongoose library
- Connect your application to the Database 
- Call the connectDB function and connect to database before starting application on 3000
- Create a userSchema & user Model

- Create POST /signup API to add data to database
- Push more documents using API calls from postman
- Error Handling using try, catch

- JS object vs JSON
- Add the express.json middleware to your app
- Make your signup API dynamic to receive data from the end user
- User.findOne with duplicate email ids, which object returned
- API - Get user by email
- API - Get user by ID
- Create a delete user API
- Difference between PATCH and PUT
- API - Update a user
- Explore the Mongoose Documentation for Model methods
- What are options in a Model.findOneAndUpdate method, explore more about it
- API - Update the user with email ID

- Explore schematype options from the doucmentation
- Add required, unquie, lowercase, min, maxLength, trim
- Add Default
Create a custome validate function for gender
- Improve the DB Schema - Put all appropiate validation on each field in Schema
- Also add timestamps in userSchema

 - Add API validation on patch request & Signup post api
 - Data sanitizing - Add API validation for each field

 - Install validator
 - Explore validator library function and use validator func for password, email, photoURL
 - Never trust req.body
 - Validate data in Signup API
 - Install bcrypt package
 - Create PasswordHash using bcrypt.hash & save the user is excrupted password 
 - Create login API
 - Compare password and throw errors if mail or password is invalid

 - Install cookie-parser
 - just send a dummy cookie to user
 - Create GET/profile API and check if you get the cookie back
 - In login API, after email and password validation,create a JWT token and send is to user in cookie
 - Read the cookies inside your profile API and fined the logged in user
 - userAuth Middleware
 - add the userAuth middleware in profile API and a new sendConnectionRequest API
 - Set the expiry of JWT token and cookies to 7 days
 - Create userSchema method to getJWT()
 - Create userSchema method to comparePassword(passwordInputByUser)
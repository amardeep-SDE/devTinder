const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        
        const connection = await mongoose.connect("mongodb+srv://amardeepdwivedi1016:UBVOQxgpXiOgKuJ4@devtinder.h0tufst.mongodb.net/devTinder?retryWrites=true&w=majority", );
        return connection; // Return the connection object
        // console.log("Database connected successfully:", connection.connection.host);
        
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
        
    }
}
module.exports = connectDB;
// UBVOQxgpXiOgKuJ4
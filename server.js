// Import Express framework
import exp from 'express';

// Import route modules for user and product APIs
import { userApp } from './APIs/UserAPI.js';
import { productApp } from './APIs/ProductAPI.js';

//Import dotenv for using .env variables
import dotenv from "dotenv";
dotenv.config();


// Import MongoDB connection function from mongoose
import { connect } from 'mongoose';

// Import cookie-parser middleware (used to read cookies)
import cookieParser from "cookie-parser";

// Create an Express application
const app = exp();



// Middleware to parse incoming JSON data from requests
// Allows server to read req.body in JSON format
app.use(exp.json());

// Middleware to parse cookies from client requests

app.use(cookieParser());




// All user-related routes will start with /user-api

app.use('/user-router', userApp);

// All product-related routes will start with /product-api

app.use('/product-router', productApp);


// Function to connect MongoDB and start the server
async function connectDB() {
    try {

        // Connect to MongoDB database
        await connect(process.env.DB_URL);

        console.log("Database Connected Successfully");

        // Start the Express server after DB connection
        app.listen(process.env.PORT, () => {
            console.log("Server running on port 4000");
        });

    } catch (err) {

        // Print error if database connection fails
        console.log("DB Error:", err);
    }
}


// Call function to connect database and start server
connectDB();

// Handles all errors from routes and middleware
app.use((err, req, res, next) => {

    // Send error response to client
    res.status(500).json({
        message: "error",
        error: err.message
    });

});

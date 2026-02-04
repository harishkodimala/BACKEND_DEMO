// Import Express framework
import exp from 'express';

// Import User Mongoose Model (Schema)
import { UserModel } from '../models/UserModel.js';     

// Import bcrypt functions for password encryption
import { hash, compare } from 'bcryptjs';

// Import JWT for authentication tokens
import jwt from 'jsonwebtoken';

// Import middleware to verify JWT token
import { verifyToken } from '../middleware/verify_token.js';


// Create a Router instance for user-related APIs
export const userApp = exp.Router();


// GET request 
// path (/user-api/users)
userApp.get('/users', async (req, res) => {

    try {

        // Fetch all users from database
        const users = await UserModel.find();

        // Send success response
        res.status(200).json({
            message: "All users",
            payload: users
        });

    } catch (err) {

        // Send error response
        res.status(500).json({
            message: "Error fetching users",
            error: err.message
        });
    }
});


// POST request
// path(/user-api/users)
userApp.post('/users', async (req, res) => {

    // Get user data from request body
    let newUser = req.body;

    // Hash (encrypt) the user's password
    // 12 → number of salt rounds (security level)
    const hashedPassword = await hash(newUser.password, 12);

    // Replace plain password with hashed password
    newUser.password = hashedPassword;

    // Create new user document
    let newUserDoc = new UserModel(newUser);

    // Save user in database
    await newUserDoc.save();

    // Send success response
    res.status(201).json({
        message: "user is created",
        payload: newUserDoc
    });
});


// POST request for login
// path(/user-api/auth)
userApp.post('/auth', async (req, res) => {

    // Get login credentials from request body
    let userCred = req.body;

    // Find user in DB by username
    let userofDB = await UserModel.findOne({ 
        username: userCred.username 
    });

    // If username not found
    if (userofDB === null) {
        return res.status(404).json({
            message: "invalid username"
        });
    }

    // Compare entered password with hashed password
    let status = await compare(
        userCred.password,
        userofDB.password
    );

    // If password does not match
    if (status === false) {
        return res.json({
            message: "invalid password"
        });
    }

    // Create JWT token
    let signedToken = jwt.sign(
        { username: userCred.username }, // Payload
        process.env.SECRET_KEY,         // Secret key 
        { expiresIn: 30 }               // Token expiry (seconds)
    );

    // Store token in HTTP-only cookie
    // httpOnly → JS cannot access cookie (security)
    res.cookie('token', signedToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    // Send success response
    res.status(200).json({
        message: "login success"
    });

});


// GET request to fetch user by id
// path(/user-api/users/:id)
userApp.get('/users/:id', async (req, res) => {

    // Get user ID from URL
    let userId = req.params.id;

    // Find user in DB
    let userObj = await UserModel.findById(userId);

    // Send response
    res.status(200).json({
        message: "user",
        payload: userObj
    });
});


// PUT request to update user by ID
// path(/user-api/users/:id)
userApp.put('/users/:id', async (req, res) => {

    // Get user ID from URL
    let objId = req.params.id;

    // Get updated data
    let modifiedUser = req.body;

    // Update user in DB
    let latestUser = await UserModel.findByIdAndUpdate(
        objId,
        { $set: { ...modifiedUser } },
        { new: true, runValidators: true }
    );

    // Send updated user
    res.status(200).json({
        message: "user updated",
        payload: latestUser
    });
});

// DELETE request to remove user by ID
// path(/user-api/users/:id)
userApp.delete('/users/:id', async (req, res) => {

    // Get user ID from URL
    let userObj = req.params.id;

    // Delete user from DB
    let deletedUser = await UserModel.findByIdAndDelete(userObj);

    // Send response
    res.status(200).json({
        message: "user is deleted",
        payload: deletedUser
    });
});

// GET request for testing authentication
// Only accessible if token is valid
// path(/user-api/test)
userApp.get("/test", verifyToken, (req, res) => {

    res.status(200).json({
        message: "Protected route"
    });

});

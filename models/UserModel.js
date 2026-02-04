// Import Schema and model from mongoose
import { Schema, model } from "mongoose";


// Create schema for User collection
const userSchema = new Schema(

    {
        // Username field
        username: {
            type: String, // Must be a string

            // Field is mandatory
            required: [true, "Username is required"],

            // Minimum length of username
            minLength: [4, "min length should be 4"],

            // Maximum length of username
            maxLength: [8, "max length should be exceeded"]
        },

        // Password field (stored in hashed form)
        password: {
            type: String, // Must be string
            required: [true, "password is required"]
        },

        // Age field
        age: {
            type: Number, // Must be number
            required: [true, "age is required"],

            // Minimum allowed age
            min: [18, "minimum 18"],

            // Maximum allowed age
            max: [25, "max is 25"]
        },

    },
    {
        // Automatically adds createdAt and updatedAt fields
        timestamps: true,

        // Allows only fields defined in schema
        // Extra fields will be ignored
        strict:"throw"
    }

);

// Create model using schema
export const UserModel = model("user", userSchema);

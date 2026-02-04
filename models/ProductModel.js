// Import  from mongoose
import { Schema, model } from "mongoose";

// Create a schema (structure) for product documents
const productSchema = new Schema({

    // Product ID
    pid: {
        type: Number, // Must be a number
        required: [true, "product Id is required"], // Mandatory field
    },

    // Product Name
    productName: {
        type: String, // Must be a string
        required: [true, "product name is required"] // Mandatory field
    },

    // Product Price
    price: {
        type: Number, // Must be a number
        required: [true, "price is required"], // Mandatory field

        // Minimum allowed price
        min: [2000, "minimum is 2000"],

        // Maximum allowed price
        max: [50000, "maximum is 50000"]
    }

});


// Create Model using schema
export const ProductModel = model("product", productSchema);

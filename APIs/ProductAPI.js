// Import Express framework
import exp from 'express';

// Import Product Mongoose Model (Schema)
import { ProductModel } from '../models/ProductModel.js';

// Create a Router instance for product APIs
export const productApp = exp.Router();



// GET request 
//path(/product-api/products)
productApp.get('/products', async (req, res) => {
    
    try {

        // Fetch all products from MongoDB
        const products = await ProductModel.find();

        // Send success response with products
        res.status(200).json({
            message: "all products",
            payload: products
        });

    } catch (err) {

        // Send error response if something fails
        res.status(500).json({
            message: "error :",
            payload: err
        });
    }
});


// POST request to add a new product
// path( /product-api/products)
productApp.post('/products', async (req, res) => {

    // Get product data from request body
    let product = req.body;

    // Create new document using Product Model
    let newProductDoc = new ProductModel(product);

    // Save product in database
    await newProductDoc.save();

    // Send success response
    res.status(200).json({
        message: "product is added",
        payload: newProductDoc
    });
});

// PUT request to update product by ID
// path(/product-api/products/:id)
productApp.put('/products/:id', async (req, res) => {

    // Get product ID from URL
    let objId = req.params.id;

    // Get updated data from request body
    let modifiedProduct = req.body;

    // Find product by ID and update it
   
    
    let latestProduct = await ProductModel.findByIdAndUpdate(
        objId,
        { $set: { ...modifiedProduct } },
        { new: true,                            // new: true → returns updated document
        runValidators: true }                  // runValidators: true → checks schema validations
    );

    // Send response with updated product
    res.status(200).json({
        message: "product is updated",
        payload: latestProduct
    });
});


// GET request to fetch one product by ID
// path(/product-api/products/:id)
productApp.get('/products/:id', async (req, res) => {

    // Get product ID from URL
    let objId = req.params.id;

    try {

        // Find product by ID
        const product = await ProductModel.findById(objId);

        // Send success response
        res.status(200).json({
            message: "product found",
            payload: product
        });

    } catch (err) {

        // Send error response
        res.status(500).json({
            message: "error :",
            payload: err.message
        });
    }
});

// DELETE request to remove product by ID
// path(/product-api/products/:id)
productApp.delete('/products/:id', async (req, res) => {

    // Get product ID from URL
    let objId = req.params.id;

    try {

        // Find product by ID and delete it
        let deletedProduct = await ProductModel.findByIdAndDelete(objId);

        // Send success response
        res.status(200).json({
            message: "product is deleted",
            payload: deletedProduct
        });

    } catch (err) {

        // Send error response if deletion fails
        res.status(404).json({
            message: "error",
            payload: err.message
        });
    }
});

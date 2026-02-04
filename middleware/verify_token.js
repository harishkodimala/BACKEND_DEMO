// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Middleware function 
export function verifyToken(req, res, next) {

    // Get token from cookies
    // Token was stored during login
    const signedToken = req.cookies.token;

    // If token is not present → user is not logged in
    if (!signedToken) {
        return res.status(401).json({
            message: "please login first"
        });
    }

    try {

        // Verify token using secret key
        // If token is valid → returns decoded payload
        const decodedToken = jwt.verify(
            signedToken,
            process.env.SECRET_KEY // Secret key
        );

        // Print decoded token
        console.log("decoded token", decodedToken);

        // Print cookie token 
        console.log("Cookies:", req.cookies.token);


        // Attach decoded user data to request object
        req.user = decodedToken;

        // Move to next middleware/route
        next();

    } catch (err) {

        // If token is invalid or expired
        res.status(401).json({
            message: "Invalid token"
        });

    }
}

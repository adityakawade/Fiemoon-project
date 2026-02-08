const jwt = require("jsonwebtoken");
const AuthMiddleware = async (req, res, next) => {
        try {
                const { authorization } = req.headers;
                // check authorixation key exist or not
                if (!authorization) {
                        return res.status(401).json({ message: "Invalid request" });
                }

                const [type, token] = authorization.split(" ");
                // check token type bearer  or not
                if (type !== "Bearer") {
                        return res.status(401).json({ message: "Invalid request" });
                }

                // verifying token with secret and injecting user payload to request object
                const user = await jwt.verify(token, process.env.JWT_SECRET);

                req.user = user;
                // forward req to controller
                next();

        } catch (error) {
                return res.status(401).json({ message: "Invalid request" });
        }



}

module.exports = AuthMiddleware;

/* 
1. firstly check authorization key is recived or not
2.check token type is bearer or not
3.validate token with secret key
4.inject user payload in req obj
5. forward the request to controller

*/
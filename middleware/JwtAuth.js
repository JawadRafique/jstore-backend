const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const isToken = req.header("Authorization");
    if (!isToken) {
        return res.status(401).send("Access denied , no token provided");
    }
    const token = req.header("Authorization").split("Bearer ")[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_HASH_KEY,
            (err, user) => {
                if (err) res.status(403).send("Token is not valid");
                req.user = user;
                next();
            }
        );
    } catch (ex) {
        res.status(400).send("invalid token");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1];
    if (!token) {
        return res.status(401).send("Access denied , no token provided");
    }
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).send("You are not allowed");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).send("You are not allowed");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};

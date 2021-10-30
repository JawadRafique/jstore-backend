const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.status(404).send({
                status: "Username, email and password required",
            });
        }
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJs.AES.encrypt(
                req.body.password,
                process.env.PASS_SECRET_HASH_KEY
            ).toString(),
        })
            .then((data) => {
                res.status(201).send({
                    data,
                });
            })
            .catch((err) => {
                res.status(400).send({
                    Error: "User Already Exist",
                });
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Login

router.post("/login", async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            res.status(404).send({
                status: "Username, email and password required",
            });
        }

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).send({
                status: "User not found",
            });
        }
        const hashPassword = await CryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_SECRET_HASH_KEY
        );
        const originalPassword = await hashPassword.toString(CryptoJs.enc.Utf8);
        if (originalPassword !== req.body.password) {
            res.status(404).send({
                status: "Wrong credential",
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_HASH_KEY,
            {
                expiresIn: "3d",
            }
        );

        const { password, ...others } = user._doc;
        res.status(200).send({
            data: others,
            token: accessToken,
        });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

const router = require("express").Router();
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middleware/JwtAuth");
const User = require("../models/User");

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = CryptoJs.AES.encrypt(
                req.body.password,
                process.env.PASS_SECRET_HASH_KEY
            ).toString();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );
        res.status(200).send(updatedUser);
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("User Deleted");
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).send({
            data: others,
        });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get All Users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).send({
            Users: users,
        });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//User Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).send(data);
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

const router = require("express").Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middleware/JwtAuth");
const Cart = require("../models/Cart");

// Create
router.post("/", verifyToken, async (req, res) => {
    try {
        const isCartExist = await Cart.findOne({ userId: req.body.userId });
        if (isCartExist) {
            res.status(400).send("Cart already exist");
        }
        await Cart.create({ ...req.body })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                res.status(400).send("Something went wrong");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        )
            .then((result) => {
                res.status(200).send(result);
            })
            .catch(() => {
                res.status(400).send("Cart not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
            .then((result) => {
                res.status(200).send("Cart Deleted");
            })
            .catch(() => {
                res.status(400).send("Cart not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get User Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findOne({ userId: req.params.userId })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch(() => {
                res.status(400).send("Cart not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Cart.find()
            .then((result) => {
                res.status(200).send(result);
            })
            .catch(res.status(400).send("Something went wrong"));
        res.status(200).send(products);
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

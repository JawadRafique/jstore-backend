const router = require("express").Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middleware/JwtAuth");
const Order = require("../models/Order");

// Create
router.post("/", verifyToken, async (req, res) => {
    try {
        await Order.create({
            userId: req.body.userId,
            products: req.body.products,
            amount: req.body.amount,
            address: req.body.address,
        })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                res.status(400).send("Required Field Missing");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndUpdate(
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
                res.status(400).send("Order not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
            .then((result) => {
                res.status(200).send("Order Deleted");
            })
            .catch(() => {
                res.status(400).send("Order not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get User Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Order.find({ userId: req.params.userId })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch(() => {
                res.status(400).send("Order not exist");
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
        await Order.find()
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

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
    try {
        await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ])
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                res.status(400).send("Error in aggregate function");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

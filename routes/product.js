const router = require("express").Router();
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middleware/JwtAuth");
const Product = require("../models/Product");

// Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const isProductExist = await Product.findOne({ title: req.body.title });
        if (isProductExist) {
            res.status(400).send("Product already exist");
        }
        await Product.create({ ...req.body })
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
        const updateProduct = await Product.findByIdAndUpdate(
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
                res.status(400).send("Product not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get Product
router.get("/find/:id", async (req, res) => {
    try {
        await Product.findById(req.params.id)
            .then((result) => {
                res.status(200).send(result);
            })
            .catch(() => {
                res.status(400).send("Product not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

//Get All Products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: { $in: [qCategory] },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).send(products);
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

// Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
            .then((result) => {
                res.status(200).send("Product Deleted");
            })
            .catch(() => {
                res.status(400).send("Product not exist");
            });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

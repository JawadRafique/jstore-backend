const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// payment
router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(400).send({
                    Status: "Payment Error",
                    ErrorType: stripeErr,
                });
                console.log(stripeErr);
            } else {
                res.status(200).send(stripeRes);
            }
        }
    );
});

module.exports = router;

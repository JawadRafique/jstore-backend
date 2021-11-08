const router = require("express").Router();
const nodemailer = require("nodemailer");

// Configs
const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.zoho.com",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    },
    secure: true,
});

const mailOptions = {
    from: "jawadrafique07@gmail.com",
    to: "jawadrafique07@gmail.com",
    subject: "Order Placed",
    html: `<p>Order Placed</p>`,
};

// Mail
router.post("/", (req, res) => {
    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                res.status(400).send({
                    status: "Error in Mail function",
                });
        });
        res.status(200).send({
            status: "Email Sent Successfully",
        });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
});

module.exports = router;

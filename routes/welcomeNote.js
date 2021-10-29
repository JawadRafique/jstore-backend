const router = require("express").Router();

router.get("/", (req, res) => {
    res.status(200).send({
        Developer: "Muhammad Jawad",
        version: "1",
        Document: "Document will be available shortly",
        Github: "https://github.com/JawadRafique/jstore-backend",
        LinkedIn: "https://www.linkedin.com/feed/",
    });
});

module.exports = router;

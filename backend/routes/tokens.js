const express = require("express");
const router = express.Router();
const { getTokens } = require("../controllers/tokensController");

router.get("/", getTokens);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getWalletDetails } = require("../controllers/walletController");

router.get("/", getWalletDetails);

module.exports = router;

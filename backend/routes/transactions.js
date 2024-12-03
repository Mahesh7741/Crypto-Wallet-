const express = require("express");
const router = express.Router();
const { getTransactionHistory, getTokenTransferStatus } = require("../controllers/transactionsController");


router.get("/history", getTransactionHistory);


router.get("/transferStatus", getTokenTransferStatus);

module.exports = router;

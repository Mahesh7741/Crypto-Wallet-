const express = require("express");
const router = express.Router();
const { getNftDetails } = require("../controllers/nftController");

router.get("/:nftId", getNftDetails);

module.exports = router;

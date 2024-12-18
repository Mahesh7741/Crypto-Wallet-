const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {
  try {
    const { userAddress, chain } = req.query;

    // Validate input
    if (!userAddress || !chain) {
      return res.status(400).json({ error: "Missing required parameters: userAddress and chain." });
    }

    // Fetch wallet data in parallel
    const [tokens, nfts, balance] = await Promise.all([
      Moralis.EvmApi.token.getWalletTokenBalances({ chain, address: userAddress }),
      Moralis.EvmApi.nft.getWalletNFTs({ chain, address: userAddress, mediaItems: true }),
      Moralis.EvmApi.balance.getNativeBalance({ chain, address: userAddress })
    ]);

    // Filter NFT data
    const myNfts = nfts.raw.result
      .map((e) => {
        if (e?.media?.media_collection?.high?.url && !e.possible_spam && e?.media?.category !== "video") {
          return e.media.media_collection.high.url;
        }
      })
      .filter(Boolean); // Remove null/undefined values

    // Construct the response
    const jsonResponse = {
      tokens: tokens.raw,
      nfts: myNfts,
      balance: balance.raw.balance / 10 ** 18, // Convert Wei to Ether
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error fetching wallet data:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Start the Moralis server and the app
Moralis.start({
  apiKey: process.env.MORALIS_KEY,
})
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening for API Calls on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start Moralis server:", error.message);
  });

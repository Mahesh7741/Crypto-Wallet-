const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Moralis = require("moralis").default;
const port = 3001;

// Import routes
const tokensRouter = require("./routes/tokens");
const walletRouter = require("./routes/wallet");

const app = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/tokens", tokensRouter);
app.use("/api/wallet", walletRouter);

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error("Failed to start Moralis server:", error.message);
});

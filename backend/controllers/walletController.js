const Moralis = require("moralis").default;

async function getWalletDetails(req, res) {
  try {
    const { userAddress, chain } = req.query;

    if (!userAddress || !chain) {
      return res.status(400).json({ error: "Missing required parameters: userAddress and chain." });
    }

    const balance = await Moralis.EvmApi.balance.getNativeBalance({ chain, address: userAddress });

    const jsonResponse = {
      balance: balance.raw.balance / 10 ** 18, // Convert Wei to Ether
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error fetching wallet details:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { getWalletDetails };

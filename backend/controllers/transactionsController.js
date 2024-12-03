const Moralis = require("moralis").default;

// Function to fetch the transaction history
async function getTransactionHistory(req, res) {
  try {
    const { userAddress, chain } = req.query;

    if (!userAddress || !chain) {
      return res.status(400).json({ error: "Missing required parameters: userAddress and chain." });
    }

    // Fetch transaction history
    const transactions = await Moralis.EvmApi.transaction.getTransactions({
      chain,
      address: userAddress,
    });

    return res.status(200).json({ transactions: transactions.raw });
  } catch (error) {
    console.error("Error fetching transaction history:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}

// Function to check token transfer status using a transaction hash
async function getTokenTransferStatus(req, res) {
  try {
    const { transactionHash, chain } = req.query;

    if (!transactionHash || !chain) {
      return res.status(400).json({ error: "Missing required parameters: transactionHash and chain." });
    }

    // Fetch token transfer status
    const transferStatus = await Moralis.EvmApi.transaction.getTransactionStatus({
      chain,
      transactionHash,
    });

    return res.status(200).json({ status: transferStatus.raw.status });
  } catch (error) {
    console.error("Error fetching transfer status:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { getTransactionHistory, getTokenTransferStatus };

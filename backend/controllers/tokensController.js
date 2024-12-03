const Moralis = require("moralis").default;

async function getTokens(req, res) {
  try {
    const { userAddress, chain } = req.query;

    if (!userAddress || !chain) {
      return res.status(400).json({ error: "Missing required parameters: userAddress and chain." });
    }

    const [tokens, nfts, balance] = await Promise.all([
      Moralis.EvmApi.token.getWalletTokenBalances({ chain, address: userAddress }),
      Moralis.EvmApi.nft.getWalletNFTs({ chain, address: userAddress, mediaItems: true }),
      Moralis.EvmApi.balance.getNativeBalance({ chain, address: userAddress })
    ]);

    const myNfts = nfts.raw.result
      .map((e) => {
        if (e?.media?.media_collection?.high?.url && !e.possible_spam && e?.media?.category !== "video") {
          return e.media.media_collection.high.url;
        }
      })
      .filter(Boolean); // Remove null/undefined values

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
}

module.exports = { getTokens };

"use client";

import { useWalletNFTs } from "@/hooks/use-wallet-nfts";
import React from "react";
import NftCard from "./nft-card";

const NftCards = () => {
  const [walletAddress, setWalletAddress] = React.useState(
    // "0xb7f7f6c52f2e2fdb1963eab30438024864c313f6" // Maior mintador de CryptoPunks
    "0xe2a83b15fc300d8457eb9e176f98d92a8ff40a49", // Maior mintador de Bored Apes
    // "0xc4505db8cc490767fa6f4b6f0f2bdd668b357a5d" // Neymar Jr. Wallet
  );

  const { nfts } = useWalletNFTs({
    address: walletAddress,
    normalizeMetadata: true,
  });

  console.log("NFTs", nfts);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nfts.map((nft) => (
        <NftCard key={`${nft.token_address}-${nft.token_id}`} nft={nft} />
      ))}
    </div>
  );
};

export default NftCards;

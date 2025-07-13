// utils/resolve-ipfs-url.ts
export const resolveIpfsUrl = (url?: string): string => {
  if (!url) return "";

  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  return url;
};

// utils/resolve-ipfs-url.ts
export const resolveIpfsUrl = (url?: string | null): string | null => {
  if (!url) return null;

  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  return url;
};

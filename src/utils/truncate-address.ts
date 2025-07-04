export function truncateAddress(address: string): string {
  if (!address || !address.startsWith("0x")) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

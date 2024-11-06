export const getRandomUuid = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map((byte) => (byte % 36).toString(36))
    .join("");
};

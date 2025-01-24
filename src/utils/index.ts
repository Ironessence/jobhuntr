export const createId = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 32;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const shortenDescription = (description: string, maxLength = 100): string => {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
};

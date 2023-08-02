export function randomChar(length: number) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i <= length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    code += chars.substring(randomNumber, randomNumber + 1)
  }

  return code
}

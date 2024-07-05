export const padStart = (
  number: number,
  replaceWith = '0',
  countOfOrders = 2,
) => {
  return number.toString().padStart(countOfOrders, replaceWith);
};

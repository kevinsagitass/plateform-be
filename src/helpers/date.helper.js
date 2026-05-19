export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

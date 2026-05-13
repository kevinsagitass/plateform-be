export const getDashboardData = () => {
  try {
    return "Hello World";
  } catch (error) {
    throw {
      message: error,
    };
  }
};

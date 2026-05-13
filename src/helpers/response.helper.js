export const successResponse = (res, status, message, data) => {
  res.status(status || 200).json({
    status: message,
    data: data,
  });
};

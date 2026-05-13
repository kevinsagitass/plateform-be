import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboardStats = (req, res) => {
  try {
    let data = getDashboardData();

    res.send(data);
  } catch (error) {
    throw error;
  }
};

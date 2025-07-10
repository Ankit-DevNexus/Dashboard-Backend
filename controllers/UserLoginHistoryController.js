import userModel from "../models/user.model.js";

export const getUserLoginHistory = async (req, res) => {
  try {
    const users = await userModel.find({}, {
      name: 1,
      email: 1,
      role: 1,
      loginHistory: 1
    }).sort({ name: 1 });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching login history", error: error.message });
  }
};

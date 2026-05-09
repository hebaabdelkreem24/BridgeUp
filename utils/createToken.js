import jwt from "jsonwebtoken";
import { setMaxListeners } from "nodemailer/lib/xoauth2";

export const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );
};

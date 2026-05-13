import jwt from "jsonwebtoken";

export const createToken = (userId ,role) => {
  return jwt.sign({ id:userId ,role: role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME || "90d",
  });
};

export default createToken;
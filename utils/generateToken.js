import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET_KEY || "fatma_ewcvtmu124%vzswop<>=aw59^.";
export const generateToken = (user) => {
console.log("=== GENERATE TOKEN ===");
  console.log("JWT_SECRET used:", process.env.JWT_SECRET_KEY);
  console.log("User:", user._id, user.role);
  

  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "90d" },
  );
};
export default generateToken;
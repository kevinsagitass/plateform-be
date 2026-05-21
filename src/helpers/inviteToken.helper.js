import jwt from "jsonwebtoken";

const SECRET = process.env.INVITE_TOKEN_SECRET;
const EXPIRES_IN = "7d";

export const generateInviteToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyInviteToken = (token) => {
  return jwt.verify(token, SECRET);
};

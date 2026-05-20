import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getTokenFromHeader = (authorization = "") => {
  const [scheme, token] = authorization.split(" ");
  return scheme === "Bearer" ? token : null;
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Please sign in first." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "popx-dev-secret");
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User session is no longer valid." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "User session is invalid or expired." });
  }
};

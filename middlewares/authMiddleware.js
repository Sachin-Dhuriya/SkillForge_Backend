import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient.js";

const authenticate = async(req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(400).json({ message: "Please login first..!!!" });

    const isBlacklisted = await redisClient.get(token)
    if(isBlacklisted) return res.status(400).json({message: 'Session Expired please login again..!!!'})

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decode;

    next();
  } catch (error) {
    res.status(400).json({message: 'Token expired, please login again..!!!'})
  }
};

export default authenticate;

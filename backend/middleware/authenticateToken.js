import "dotenv/config";

import jwt from "jsonwebtoken";

import Token from "../models/token.js";

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  } else {
    const existing = await Token.findOne({ token: token });
    if (!existing) {
      return res.sendStatus(403);
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, login) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          req.login = login;
          next();
        }
      });
    }
  }
}

export default authenticateToken;

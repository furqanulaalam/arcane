import "dotenv/config";

import jwt from "jsonwebtoken";

function generateAccessToken(login) {
  return jwt.sign({ login }, process.env.ACCESS_TOKEN_SECRET);
}

export default generateAccessToken;

import fs from "fs";
import { randomBytes } from "crypto";

const generateServerKey = () => {
  if (!fs.existsSync("./db/serverKey.json")) {
    const key = { key: randomBytes(64).toString("hex") };
    const jsonKey = JSON.stringify(key);
    fs.writeFileSync("./db/serverKey.json", jsonKey);
    console.log("Key generated!");
  } else {
    console.log("Key already exists!");
  }
};

export default generateServerKey;

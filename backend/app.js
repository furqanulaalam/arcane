import express from "express";
import cors from "cors";

import "./db/mongoose.js";

import userRouter from "./routers/user.js";
import postRouter from "./routers/post.js";
import serverRouter from "./routers/server.js";

import generateServerKey from "./helpers/generateServerKey.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(userRouter);
app.use(postRouter);
app.use(serverRouter);

app.listen(4000, () => {
  generateServerKey();
  console.log("Server is listening on port 4000!");
});

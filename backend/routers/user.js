import "dotenv/config";

import fs from "fs";
import path from "path";

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import multer from "multer";
import axios from "axios";

import authenticateToken from "../middleware/authenticateToken.js";
import generateAccessToken from "../helpers/generateAccessToken.js";
import getJsonFromIpfs from "../helpers/ipfs.js";
import requestFriendServer from "../helpers/requestFriendServer.js";
import { downloadFile } from "../helpers/downloadFile.js";

import User from "../models/user.js";
import Token from "../models/token.js";
import Key from "../models/key.js";
import Post from "../models/post.js";
import Deleted from "../models/deleted.js";

const router = new express.Router();

router.post("/user/register", async (req, res) => {
  try {
    const { name, email, birthdate, password, username } = req.body.formData;
    const existsEmail = await User.findOne({ email });
    const existsUsername = await User.findOne({ username });
    const existsDeleted = await Deleted.findOne({ username });
    const exists = existsEmail || existsUsername || existsDeleted;
    if (exists) res.send({ exists });
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        birthdate,
        password: hashedPassword,
        username,
      });

      await user.save();

      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/user/token", async (req, res) => {
  try {
    const token = req.body.formData.userToken;
    const username = req.body.formData.username;
    const decoded = jwt.decode(token);
    const existsEmail = await User.findOne({ email: decoded.email });
    const existsUsername = await User.findOne({ username });
    const existsDeleted = await Deleted.findOne({ username });
    const exists = existsEmail || existsUsername || existsDeleted;
    if (exists) res.send({ exists });
    else {
      const verified = await axios.post(
        "//" + decoded.serverURL + "/server/user/verify",
        { token }
      );
      if (verified.data.verified) {
        const password = req.body.formData.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          name: decoded.name,
          email: decoded.email,
          birthdate: decoded.birthdate,
          password: hashedPassword,
          username,
          posts: decoded.posts,
          blocked: decoded.blocked,
        });
        decoded.posts.forEach(async (post) => {
          const newPost = new Post({ cid: post });
          await newPost.save();
        });
        await user.save();

        res.sendStatus(200);
      }
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.post("/user/login", async (req, res) => {
  const login = req.body.formData.email;

  try {
    const pword = req.body.formData.password;
    const user = await User.findOne({ email: login });

    if (user) {
      const result = await bcrypt.compare(pword, user.password);

      if (result) {
        const accessToken = generateAccessToken(login);

        const token = new Token({
          token: accessToken,
        });
        await token.save();

        res.send({
          accessToken,
          userEmail: login,
          name: user.name,
          username: user.username,
        });
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get(
  "/user/profile/:targetUsername",
  authenticateToken,
  async (req, res) => {
    try {
      if (req.params.targetUsername.includes("@" + process.env.SERVER_URL)) {
        const user = await User.findOne({
          username: req.params.targetUsername,
        });

        if (user) {
          res.send({ name: user.name, targetUsername: user.username });
        } else {
          res.sendStatus(404);
        }
      } else {
        const data = await requestFriendServer(
          req.params.targetUsername,
          "/user/profile/"
        );

        if (data) res.send(data.data);
        else {
          res.sendStatus(400);
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  }
);

router.get(
  "/user/outside/posts/:targetUsername",
  authenticateToken,
  async (req, res) => {
    const username = req.params.targetUsername;
    const user = await User.findOne({ username });
    res.send({ posts: user.posts });
  }
);

router.get(
  "/user/following/:targetUsername",
  authenticateToken,
  async (req, res) => {
    try {
      const email = req.login.login;
      const check = req.params.targetUsername;
      const user = await User.findOne({ email });
      const isFollowing = user.following.includes(check);
      res.send({ isFollowing });
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

router.post("/user/follow", authenticateToken, async (req, res) => {
  try {
    const targetUsername = req.body.targetUsername;
    const user = await User.findOne({ email: req.login.login });
    if (!user) return res.sendStatus(400);
    if (user.username != targetUsername) {
      const change1 = await User.findOneAndUpdate(
        { username: user.username },
        { $push: { following: targetUsername } },
        {
          new: true,
        }
      );
      if (targetUsername.includes("@" + process.env.SERVER_URL)) {
        const change2 = await User.findOneAndUpdate(
          { username: targetUsername },
          { $push: { followers: user.username } },
          {
            new: true,
          }
        );
        res.send({ status: true });
      } else {
        const url = targetUsername.split("@")[1];
        const baseURL = "/" + url + "/user/outside/follow/";
        const key = await Key.findOne({ url });
        const response = await axios.post(
          `/${baseURL}${targetUsername}`,
          { follower: user.username },
          {
            timeout: 2000,
            headers: {
              Authorization: `Bearer ${key.key}`,
            },
          }
        );
        if (response.data.success) res.send({ status: true });
        else res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post(
  "/user/outside/follow/:targetUsername",
  authenticateToken,
  async (req, res) => {
    const targetUsername = req.params.targetUsername;
    const follower = req.body.follower;

    if (!(follower.split("@")[1] === req.login.login))
      return res.sendStatus(400);
    const change = await User.findOneAndUpdate(
      { username: targetUsername },
      { $push: { followers: follower } },
      {
        new: true,
      }
    );
    res.send({ success: true });
  }
);

router.post("/user/unfollow", authenticateToken, async (req, res) => {
  try {
    const targetUsername = req.body.targetUsername;
    const user = await User.findOne({ email: req.login.login });
    if (!user) return res.sendStatus(400);
    if (user.username !== targetUsername) {
      const change1 = await User.findOneAndUpdate(
        { username: user.username },
        { $pull: { following: targetUsername } },
        { new: true }
      );
      if (targetUsername.includes("@" + process.env.SERVER_URL)) {
        const change2 = await User.findOneAndUpdate(
          { username: targetUsername },
          { $pull: { followers: user.username } },
          { new: true }
        );
        res.send({ status: true });
      } else {
        const url = targetUsername.split("@")[1];
        const baseURL = "/" + url + "/user/outside/unfollow/";
        const key = await Key.findOne({ url });
        const response = await axios.post(
          `/${baseURL}${targetUsername}`,
          { follower: user.username },
          {
            timeout: 2000,
            headers: {
              Authorization: `Bearer ${key.key}`,
            },
          }
        );
        if (response.data.success) res.send({ status: true });
        else res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post(
  "/user/outside/unfollow/:targetUsername",
  authenticateToken,
  async (req, res) => {
    const targetUsername = req.params.targetUsername;
    const follower = req.body.follower;

    if (!(follower.split("@")[1] === req.login.login))
      return res.sendStatus(400);
    const change = await User.findOneAndUpdate(
      { username: targetUsername },
      { $pull: { followers: follower } },
      {
        new: true,
      }
    );
    res.send({ success: true });
  }
);

router.get(
  "/user/posts/:targetUsername",
  authenticateToken,
  async (req, res) => {
    try {
      if (req.params.targetUsername.includes("@" + process.env.SERVER_URL)) {
        const user = await User.findOne({
          username: req.params.targetUsername,
        });

        if (user) {
          const postPromises = user.posts.map(async (cid) => {
            const cont = await getJsonFromIpfs(cid);
            cont.cid = cid;
            cont.username = user.username;
            return cont;
          });
          let posts = await Promise.all(postPromises);
          posts = posts.map((post) => {
            delete post.creator;
            return post;
          });

          res.send(posts);
        } else {
          res.sendStatus(400);
        }
      } else {
        const response = await requestFriendServer(
          req.params.targetUsername,
          "/user/posts/"
        );
        if (response) res.send(response.data);
        else res.sendStatus(400);
      }
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

router.get(
  "/user/list/:targetUsername&:type",
  authenticateToken,
  async (req, res) => {
    const targetUsername = req.params.targetUsername;
    const type = req.params.type.toLowerCase();
    if (targetUsername.includes("@" + process.env.SERVER_URL)) {
      const user = await User.findOne({ username: targetUsername });
      if (user) res.send(user[type]);
      else res.sendStatus(400);
    } else {
      const url = targetUsername.split("@")[1];
      const key = await Key.findOne({ url });
      const base_url = "/" + url + "/user/list/";
      if (key) {
        const response = await axios.get(
          `/${base_url}${targetUsername}&${type}`,
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${key.key}`,
            },
          }
        );
        if (response) res.send(response.data);
        else res.sendStatus(400);
      } else res.sendStatus(400);
    }
  }
);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.put(
  "/user/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    const email = req.login.login;
    const user = await User.findOne({ email });
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 170, height: 170 })
      .png()
      .toBuffer();
    fs.writeFileSync(`./db/images/${user.username}.png`, buffer);
    res.send({ success: true });
  }
);

router.get("/user/avatar/:avatarId", async (req, res) => {
  const username = req.params.avatarId;
  res.set("Content-Type", "image/png");

  if (username.includes("@" + process.env.SERVER_URL)) {
    const imgPath = path.resolve(`./db/images/${username}.png`);
    const defaultPath = path.resolve(`./db/images/lufy.png`);
    if (fs.existsSync(imgPath)) {
      res.sendFile(imgPath);
    } else {
      res.sendFile(defaultPath);
    }
  } else {
    const url = username.split("@")[1];
    const key = await Key.findOne({ url });
    const base_url = "//" + url + "/user/avatar/";
    if (key) {
      const finished = await downloadFile(
        base_url,
        `./db/images/temp/${username}.png`,
        `Bearer ${key.key}`,
        username
      );
      if (fs.existsSync(`./db/images/temp/${username}.png`))
        res.sendFile(path.resolve(`./db/images/temp/${username}.png`));
      else res.sendStatus(400);
    } else {
      res.sendStatus(400);
    }
  }
});

router.delete("/user/logout", authenticateToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const del = await Token.deleteOne({ token });
  if (del) res.send(true);
});

router.delete("/user/delete", authenticateToken, async (req, res) => {
  const email = req.login.login;
  const password = req.body.password;
  const user = await User.findOne({ email: email });

  if (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const userData = {
        name: user.name,
        email: user.email,
        birthdate: user.birthDate,
        posts: user.posts,
        blocked: user.blocked,
        serverURL: process.env.SERVER_URL,
      };

      user.following.forEach(async (element) => {
        if (element.includes("@" + process.env.SERVER_URL)) {
          const change = await User.findOneAndUpdate(
            { username: element },
            { $pull: { followers: user.username } },
            {
              new: true,
            }
          );
        } else {
          const url = element.split("@")[1];
          const key = await Key.findOne({ url });
          const base_url = "//" + url + "/server/delete/follower";
          const res = await axios.delete(
            `${base_url}`,

            {
              headers: {
                Authorization: `Bearer ${key.key}`,
              },
              data: { from: element, delete: user.username },
            }
          );
        }
      });

      user.followers.forEach(async (element) => {
        if (element.includes("@" + process.env.SERVER_URL)) {
          const change = await User.findOneAndUpdate(
            { username: element },
            { $pull: { following: user.username } },
            {
              new: true,
            }
          );
        } else {
          const url = element.split("@")[1];
          const key = await Key.findOne({ url });
          const base_url = "//" + url + "/server/delete/following";
          const res = await axios.delete(
            `${base_url}`,

            {
              headers: {
                Authorization: `Bearer ${key.key}`,
              },
              data: { from: element, delete: user.username },
            }
          );
        }
      });

      user.posts.forEach(async (element) => {
        const del = await Post.deleteOne({ cid: element });
      });
      if (fs.existsSync(`./db/images/${user.username}.png`))
        fs.unlinkSync(`./db/images/${user.username}.png`);

      const keyBuffer = fs.readFileSync("./db/serverKey.json");
      const keyJSON = keyBuffer.toString();
      const key = JSON.parse(keyJSON).key;
      const tokenisedData = jwt.sign(userData, key);
      const tokenisedDataToken = new Token({
        token: tokenisedData,
      });
      await tokenisedDataToken.save();
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const delToken = await Token.deleteOne({ token });
      const del = await User.deleteOne({ email: email });
      const deletedUser = new Deleted({
        email: user.email,
        username: user.username,
      });
      await deletedUser.save();
      res.send({ tokenisedData, status: true });
    } else {
      res.send({ status: false });
    }
  }
});

router.get(
  "/user/blocked/:targetUsername",
  authenticateToken,
  async (req, res) => {
    try {
      const email = req.login.login;
      const check = req.params.targetUsername;
      const user = await User.findOne({ email });
      const isBlocked = user.blocked.includes(check);

      res.send({ isBlocked });
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

router.post("/user/blocked", authenticateToken, async (req, res) => {
  const email = req.login.login;
  const targetUsername = req.body.targetUsername;
  const user = await User.findOne({ email });
  let followingFlag = false;
  let followerFlag = false;
  if (user.blocked.includes(targetUsername)) {
    const change = await User.findOneAndUpdate(
      { email },
      { $pull: { blocked: targetUsername } },
      {
        new: true,
      }
    );
  } else {
    const change = await User.findOneAndUpdate(
      { email },
      { $push: { blocked: targetUsername } },
      {
        new: true,
      }
    );

    if (user.following.includes(targetUsername)) {
      followingFlag = true;
      const change = await User.findOneAndUpdate(
        { email },
        { $pull: { following: targetUsername } },
        {
          new: true,
        }
      );
    }

    if (user.followers.includes(targetUsername)) {
      followerFlag = true;
      const change = await User.findOneAndUpdate(
        { email },
        { $pull: { followers: targetUsername } },
        {
          new: true,
        }
      );
    }

    if (targetUsername.includes("@" + process.env.SERVER_URL)) {
      if (followingFlag) {
        const change = await User.findOneAndUpdate(
          { username: targetUsername },
          { $pull: { followers: user.username } },
          {
            new: true,
          }
        );
      }
      if (followerFlag) {
        const change = await User.findOneAndUpdate(
          { username: targetUsername },
          { $pull: { following: user.username } },
          {
            new: true,
          }
        );
      }
    } else {
      const url = targetUsername.split("@")[1];
      const key = await Key.findOne({ url });
      const base_url = "//" + url + "/user/outside/blocked/";
      const response = await axios.post(
        base_url,
        {
          username: targetUsername,
          toRemove: user.username,
          followingFlag,
          followerFlag,
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${key.key}`,
          },
        }
      );
      if (!response.data.status) return res.sendStatus(400);
    }
  }

  res.send({ status: true });
});

router.post("/user/outside/blocked", authenticateToken, async (req, res) => {
  const { username, toRemove, followerFlag, followingFlag } = req.body;
  if (req.login.login === toRemove.split("@")[1]) {
    if (followingFlag) {
      const change = await User.findOneAndUpdate(
        { username },
        { $pull: { followers: toRemove } },
        {
          new: true,
        }
      );
    }
    if (followerFlag) {
      const change = await User.findOneAndUpdate(
        { username },
        { $pull: { following: toRemove } },
        {
          new: true,
        }
      );
    }
    return res.send({ status: true });
  }
  res.send({ status: false });
});

router.get(
  "/user/blocker/:targetUsername&:username",
  authenticateToken,
  async (req, res) => {
    console.log("req res");
    const targetUsername = req.params.targetUsername;
    const username = req.params.username;
    if (targetUsername.includes("@" + process.env.SERVER_URL)) {
      const check = await User.findOne({ username: targetUsername });
      if (check.blocked.includes(username)) res.send({ blocker: true });
      else res.send({ blocker: false });
    } else {
      const url = targetUsername.split("@")[1];
      const baseURL = "//" + url + "/user/blocker/";
      const key = await Key.findOne({ url });
      const response = await axios.get(
        `${baseURL}${targetUsername}&${username}`,

        {
          timeout: 2000,
          headers: {
            Authorization: `Bearer ${key.key}`,
          },
        }
      );

      res.send(response.data);
    }
  }
);

export default router;

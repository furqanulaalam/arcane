import fs from "fs";
import express from "express";

import jwt from "jsonwebtoken";

import Friend from "../models/friend.js";
import Key from "../models/key.js";
import Token from "../models/token.js";
import User from "../models/user.js";

import generateAccessToken from "../helpers/generateAccessToken.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = new express.Router();

router.post("/server", async (req, res) => {
  const ownerName = req.body.formData.name;
  const ownerEmail = req.body.formData.email;
  const serverName = req.body.formData.serverName;
  const serverURL = req.body.formData.serverURL;
  const key = req.body.formData.key;
  const exists = await Friend.findOne({ serverURL });
  if (exists) res.send({ exists });
  else {
    const server = new Friend({
      ownerEmail,
      ownerName,
      serverName,
      serverURL,
    });
    const token = generateAccessToken(serverURL);
    const newKey = new Key({
      url: serverURL,
      key,
    });
    const serverToken = new Token({
      token,
    });
    await serverToken.save();
    await server.save();
    await newKey.save();
    res.status(200).send(token);
  }
});

router.post("/server/friend", async (req, res) => {
  const ownerName = req.body.formData.name;
  const ownerEmail = req.body.formData.email;
  const serverName = req.body.formData.serverName;
  const serverURL = req.body.formData.serverURL;
  const ownKey = req.body.formData.ownKey;
  const keyBuffer = fs.readFileSync("./db/serverKey.json");
  const keyJSON = keyBuffer.toString();
  const key = JSON.parse(keyJSON).key;
  if (key === ownKey) {
    const exists = await Friend.findOne({ serverURL });

    if (exists) res.send({ exists });
    else {
      const server = new Friend({
        ownerEmail,
        ownerName,
        serverName,
        serverURL,
      });
      const token = generateAccessToken(serverURL);
      const serverToken = new Token({
        token,
      });
      await serverToken.save();
      await server.save();
      res.status(200).send(token);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/server/key", async (req, res) => {
  const serverURL = req.body.formData.serverURL;
  const ownKey = req.body.formData.ownKey;
  const friendKey = req.body.formData.friendKey;
  const keyBuffer = fs.readFileSync("./db/serverKey.json");
  const keyJSON = keyBuffer.toString();
  const key = JSON.parse(keyJSON).key;
  if (key === ownKey) {
    const exists = await Key.findOne({ url: serverURL });

    if (exists) res.send({ exists });
    else {
      const newKey = new Key({
        url: serverURL,
        key: friendKey,
      });

      await newKey.save();
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
});

router.delete(
  "/server/delete/follower",
  authenticateToken,
  async (req, res) => {
    const server = req.login.login;
    const from = req.body.from;
    const del = req.body.delete;
    const delServerURL = del.split("@")[1];

    if (!(delServerURL === server)) res.sendStatus(400);
    else {
      const change = await User.findOneAndUpdate(
        { username: from },
        { $pull: { followers: del } },
        {
          new: true,
        }
      );
      res.send({ deleted: true });
    }
  }
);

router.delete(
  "/server/delete/following",
  authenticateToken,
  async (req, res) => {
    const server = req.login.login;
    const from = req.body.from;
    const del = req.body.delete;
    const delServerURL = del.split("@")[1];
    if (!(delServerURL === server)) res.sendStatus(400);
    else {
      const change = await User.findOneAndUpdate(
        { username: from },
        { $pull: { following: del } },
        {
          new: true,
        }
      );
      res.send({ deleted: true });
    }
  }
);

router.post("/server/user/verify", async (req, res) => {
  const token = req.body.token;
  const keyBuffer = fs.readFileSync("./db/serverKey.json");
  const keyJSON = keyBuffer.toString();
  const key = JSON.parse(keyJSON).key;
  const existing = await Token.findOne({ token: token });
  if (existing) {
    jwt.verify(token, key, async (err, login) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        await Token.deleteOne({ token });

        return res.send({ verified: true });
      }
    });
  }
});

export default router;

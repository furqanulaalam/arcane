import "dotenv/config";

import express from "express";
import axios from "axios";

import getJsonFromIpfs, { client } from "../helpers/ipfs.js";
import authenticateToken from "../middleware/authenticateToken.js";

import User from "../models/user.js";
import Key from "../models/key.js";
import Post from "../models/post.js";

const router = new express.Router();

router.get("/home", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.login.login });
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
      if (user.following.length != 0) {
        const followingPromise = user.following.map(async (targetUsername) => {
          if (targetUsername.includes("@" + process.env.SERVER_URL)) {
            const following = await User.findOne({ username: targetUsername });

            return following;
          } else {
            const serverURL = targetUsername.split("@")[1];
            const key = await Key.findOne({ url: serverURL });
            const following = await axios.get(
              `//${serverURL}/user/outside/posts/${targetUsername}`,
              {
                headers: {
                  Authorization: `Bearer ${key.key}`,
                },
              }
            );
            following.data.username = targetUsername;

            return following.data;
          }
        });
        const following = await Promise.all(followingPromise);
        console.log(following);
        const followingPostsPromises = following.map(async (person) => {
          const posts = person.posts.map(async (cid) => {
            const cont = await getJsonFromIpfs(cid);
            cont.cid = cid;
            cont.username = person.username;
            return cont;
          });
          const followingPosts = await Promise.all(posts);

          return followingPosts;
        });

        const followingPosts = await Promise.all(followingPostsPromises);

        let flattenedPosts = followingPosts.flat();
        flattenedPosts = flattenedPosts.map((post) => {
          delete post.creator;
          return post;
        });

        posts.push(...flattenedPosts);
        res.send(posts);
      } else res.send(posts);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post("/post", authenticateToken, async (req, res) => {
  const user = await User.findOne({ email: req.login.login });
  const username = user.username;
  const post = {
    creator: req.login.login,
    username,
    created: req.body.now,
    text: req.body.postText,
  };
  const { cid } = await client.add(JSON.stringify(post));

  const changed = await User.findOneAndUpdate(
    { email: req.login.login },
    { $push: { posts: cid.toString() } },
    {
      new: true,
    }
  );

  const postDetails = new Post({ cid });
  await postDetails.save();

  res.sendStatus(200);
});

router.get(
  "/post/likes/:cid&:creator&:username",
  authenticateToken,
  async (req, res) => {
    const cid = req.params.cid;
    const creator = req.params.creator;
    const username = req.params.username;
    if (creator.includes("@" + process.env.SERVER_URL)) {
      const postLikes = await Post.findOne({ cid });
      res.send({
        likes: postLikes.likes.length,
        liked: postLikes.likes.includes(username),
      });
    } else {
      const url = creator.split("@")[1];
      const key = await Key.findOne({ url });

      const baseURL = "//" + url + "/post/likes/";
      const response = await axios.get(
        `${baseURL}${cid}&${creator}&${username}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${key.key}`,
          },
        }
      );
      res.send(response.data);
    }
  }
);

router.post(
  "/post/likes/:cid&:creator",
  authenticateToken,
  async (req, res) => {
    const cid = req.params.cid;
    const targetUsername = req.params.creator;
    const liker = (req.body = req.body.liker);
    const user = await User.findOne({ email: req.login.login });
    if (user) {
      if (user.username !== liker) return res.sendStatus(400);
    } else if (!(req.login.login === liker.split("@")[1]))
      return res.sendStatus(400);
    if (targetUsername.includes("@" + process.env.SERVER_URL)) {
      const postLikes = await Post.findOne({ cid });
      if (postLikes.likes.includes(liker)) {
        const change = await Post.findOneAndUpdate(
          { cid },
          { $pull: { likes: liker } },
          {
            new: true,
          }
        );
        res.send({ like: false });
      } else {
        const change = await Post.findOneAndUpdate(
          { cid },
          { $push: { likes: liker } },
          {
            new: true,
          }
        );
        res.send({ like: true });
      }
    } else {
      const url = targetUsername.split("@")[1];
      const key = await Key.findOne({ url });
      const baseURL = "//" + url + "/post/likes/";
      const response = await axios.post(
        `${baseURL}${cid}&${targetUsername}`,
        { liker },
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${key.key}`,
          },
        }
      );
      res.send(response.data);
    }
  }
);

router.post("/post/comments", authenticateToken, async (req, res) => {
  const cid = req.body.cid;
  const username = req.body.username;
  const comment = req.body.formData.comment;
  const creator = req.body.creator;
  const user = await User.findOne({ email: req.login.login });
  if (user) {
    if (user.username !== username) return res.sendStatus(400);
  } else if (!(req.login.login === username.split("@")[1]))
    return res.sendStatus(400);

  if (creator.includes("@" + process.env.SERVER_URL)) {
    const change = await Post.findOneAndUpdate(
      { cid },
      { $push: { comments: { username, comment } } }
    );
    if (change) res.send({ success: true });
    else res.send({ success: false });
  } else {
    const url = creator.split("@")[1];
    const key = await Key.findOne({ url });
    const baseURL = "//" + url + "/post/comments";
    const response = await axios.post(
      `${baseURL}`,
      { username, formData: req.body.formData, cid, creator },
      {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${key.key}`,
        },
      }
    );
    if (response.data.success) res.send({ success: true });
    else res.send({ success: false });
  }
});

router.get(
  "/post/comments/:cid&:creator",
  authenticateToken,
  async (req, res) => {
    const cid = req.params.cid;
    const creator = req.params.creator;
    if (creator.includes("@" + process.env.SERVER_URL)) {
      const post = await Post.findOne({ cid });
      if (post) res.send({ comments: post.comments });
      else res.send(400);
    } else {
      const url = creator.split("@")[1];
      const key = await Key.findOne({ url });
      const baseURL = "//" + url + "/post/comments";
      const response = await axios.get(
        `${baseURL}/${cid}&${creator}`,

        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${key.key}`,
          },
        }
      );
      if (response) res.send({ comments: response.data.comments });
      else res.send(400);
    }
  }
);

export default router;

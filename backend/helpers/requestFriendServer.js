import axios from "axios";

import Key from "../models/key.js";

const requestFriendServer = async (targetUsername, path) => {
  const url = targetUsername.split("@")[1];
  const key = await Key.findOne({ url });

  if (key) {
    const base_url = "//" + url + path;
    const response = await axios.get(`${base_url}${targetUsername}`, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${key.key}`,
      },
    });
    if (response) return response;
    else return null;
  } else return null;
};

export default requestFriendServer;

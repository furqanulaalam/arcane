import { Box, List, ListItem } from "@chakra-ui/react";

import { useEffect, useContext, useState } from "react";

import AuthContext from "../context/AuthProvider";

import Post from "./Post";
import axios from "axios";

const ProfilePostsHolder = () => {
  const [postsList, setPostsList] = useState([]);
  const { auth, username } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/user/posts/${username}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        setPostsList(
          response.data
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .map((post, i) => (
              <ListItem key={i}>
                <Post creator={post.username} text={post.text} cid={post.cid} />
              </ListItem>
            ))
        );
      });
  }, []);

  return (
    <Box margin={"auto"} width={"70%"} marginTop={"40px"}>
      <List>{postsList}</List>
    </Box>
  );
};

export default ProfilePostsHolder;

import { Box, Heading, List, ListItem } from "@chakra-ui/react";

import { useEffect, useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthProvider";

import Post from "./Post";
import ProfileButton from "./ProfileButton";
import CreatePost from "./CreatePost";
import axios from "axios";

const PostsHolder = () => {
  const navigate = useNavigate();
  const [postsList, setPostsList] = useState([]);
  const { auth, isAuth } = useContext(AuthContext);
  const [count, setCount] = useState(0);
  const stringToBoolean = (boolInString) => {
    if (typeof boolInString === "boolean") return boolInString;
    if (boolInString === "true") return true;
    else return false;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 5000); // update every 5 seconds

    return () => clearInterval(intervalId); // cleanup function to stop the interval
  }, []);
  useEffect(() => {
    if (!stringToBoolean(isAuth)) navigate("/");
    else {
      axios
        .get(`/home`, {
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
                  <Post
                    creator={post.username}
                    text={post.text}
                    cid={post.cid}
                  />
                </ListItem>
              ))
          );
        });
    }
  }, [count]);

  return (
    <Box>
      <ProfileButton />

      <Box
        margin={"auto"}
        backgroundColor={"black"}
        width={"50%"}
        height={"100vh"}
      >
        <Heading
          as="h2"
          size="3xl"
          color={"#ddd2f7"}
          textAlign={"center"}
          marginBottom={"80px"}
        >
          <Link to="/home">arcane</Link>
        </Heading>
        {isAuth ? (
          <Box margin={"auto"} width={"60%"}>
            <CreatePost />
            <List>{postsList}</List>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default PostsHolder;

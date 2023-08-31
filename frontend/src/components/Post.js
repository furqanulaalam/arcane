import { useState, useEffect, useContext } from "react";
import axios from "axios";

import CommentWriter from "./CommentWriter";
import CommentsModal from "./CommentsModal";

import AuthContext from "../context/AuthProvider";

import {
  Card,
  CardHeader,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";

import { BiLike, BiSolidLike } from "react-icons/bi";

const Post = ({ creator, text, cid }) => {
  const { auth, username } = useContext(AuthContext);
  const [likesCounter, setLikesCounter] = useState(0);
  const [liked, setLiked] = useState(false);
  const handleLike = async () => {
    const res = await axios.post(
      `/post/likes/${cid}&${creator}`,
      { liker: username },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    if (res.data.like) setLikesCounter(likesCounter + 1);
    else setLikesCounter(likesCounter - 1);
  };
  useEffect(() => {
    axios
      .get(`/post/likes/${cid}&${creator}&${username}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        setLikesCounter(response.data.likes);
        setLiked(response.data.liked);
      });
  }, [likesCounter, liked, cid]);
  return (
    <Card
      maxW="sm"
      backgroundColor={"black"}
      color={"white"}
      border={"1px solid #ddd2f7"}
      m={"20px"}
    >
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name="Lufy" src={`/user/avatar/${creator}`} />

            <Box>
              <Heading size="sm">{creator}</Heading>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{text}</Text>
      </CardBody>

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button
          flex="1"
          variant="ghost"
          color={"white"}
          leftIcon={!liked ? <BiLike /> : <BiSolidLike />}
          _hover={{ color: "black", bg: "white" }}
          onClick={handleLike}
        >
          {likesCounter}
        </Button>

        <CommentWriter creator={creator} cid={cid} />
        <CommentsModal creator={creator} cid={cid} />
      </CardFooter>
    </Card>
  );
};

export default Post;

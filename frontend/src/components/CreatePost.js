import { useState, useContext } from "react";
import {
  Box,
  Textarea,
  Button,
  useColorModeValue,
  useToast,
  Divider,
} from "@chakra-ui/react";

import AuthContext from "../context/AuthProvider";
import axios from "axios";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const toast = useToast();
  const { auth } = useContext(AuthContext);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    const now = new Date();
    // Code to submit post
    // Show success message
    try {
      const res = await axios.post(
        "/post",
        { postText, now },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
    toast({
      title: "Post Created",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const inputBgColor = useColorModeValue("gray.100", "gray.700");
  const inputTextColor = useColorModeValue("gray.900", "gray.50");

  return (
    <Box
      p={4}
      shadow="md"
      rounded="md"
      bg={inputBgColor}
      mb={"10px"}
      backgroundColor={"black"}
    >
      <form onSubmit={handlePostSubmit}>
        <Textarea
          placeholder="What's on your mind?"
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          size="lg"
          resize="none"
          bg={inputBgColor}
          color={inputTextColor}
          mb={2}
          autoFocus
          required
        />
        <Button
          backgroundColor={"#8540b3"}
          color="#ddd2f7"
          mr={3}
          type="submit"
        >
          Post
        </Button>
      </form>
      <Divider color="white" mt={"10px"} />
    </Box>
  );
};

export default CreatePost;

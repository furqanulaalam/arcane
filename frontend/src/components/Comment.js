import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Comment = ({ username, comment }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4} marginBottom={4}>
      <Text fontWeight="bold">{username}</Text>
      <Text mt={2}>{comment}</Text>
    </Box>
  );
};

export default Comment;

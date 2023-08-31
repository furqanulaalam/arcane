import React, { useState, useContext } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { BiChat } from "react-icons/bi";

import axios from "axios";

import AuthContext from "../context/AuthProvider";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";

const CommentWriter = ({ creator, cid }) => {
  const { auth, username } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [formData, setFormData] = useState({
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "/post/comments",
      { formData, username, cid, creator },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    if (response.data.success) alert("Comment added!");
    else alert("Operation failed!");
  };
  return (
    <>
      <Button
        flex="1"
        variant="ghost"
        color={"white"}
        leftIcon={<BiChat />}
        _hover={{ color: "black", bg: "white" }}
        onClick={onOpen}
      >
        Comment
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent backgroundColor={"black"} color={"white"}>
            <ModalHeader>Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Comment</FormLabel>
                <Input
                  placeholder="Comment"
                  required
                  value={formData.comment}
                  name="comment"
                  onChange={handleChange}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                backgroundColor={"#8540b3"}
                color="#ddd2f7"
                mr={3}
                type="submit"
              >
                Comment
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CommentWriter;

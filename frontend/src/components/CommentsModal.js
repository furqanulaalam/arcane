import React, { useState, useContext, useEffect } from "react";

import axios from "axios";

import AuthContext from "../context/AuthProvider";
import Comment from "./Comment";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  List,
  ListItem,
  Link,
} from "@chakra-ui/react";

const CommentsModal = ({ creator, cid }) => {
  const { auth } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  useEffect(() => {
    axios
      .get(`/post/comments/${cid}&${creator}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        console.log(response.data.comments);
        setComments(
          response.data.comments.map((comment, i) => (
            <ListItem key={i}>
              <Comment username={comment.username} comment={comment.comment} />
            </ListItem>
          ))
        );
      });
  }, []);

  return (
    <>
      <Link onClick={onOpen} textDecoration={"underline"}>
        Show all comments.
      </Link>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent backgroundColor={"black"} color={"white"}>
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <List>{comments}</List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentsModal;

import React, { useState, useContext } from "react";
import { useDisclosure } from "@chakra-ui/react";

import AuthContext from "../context/AuthProvider";

import axios from "axios";

import { BiImageAdd } from "react-icons/bi";

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

const ProfilePictureButton = () => {
  const { auth } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [avatar, setAvatar] = useState("");

  const handleFile = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);

    if (avatar) {
      const response = await axios.put("/user/avatar", formData, {
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) window.location.reload();
      else alert("Operation failed!");
    } else alert("Select a picture!");
  };
  return (
    <>
      <Button
        onClick={onOpen}
        margin={"10px"}
        backgroundColor={"#8540b3"}
        color={"#DDD2F7"}
        leftIcon={<BiImageAdd />}
      ></Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent backgroundColor={"black"} color={"white"}>
            <ModalHeader>Update profile picture.</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Avatar</FormLabel>
                <Input
                  type="file"
                  required
                  name="avatar"
                  onChange={handleFile}
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
                Upload
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ProfilePictureButton;

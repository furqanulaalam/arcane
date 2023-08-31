import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

import axios from "axios";

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

import AuthContext from "../context/AuthProvider";

const Delete = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [formData, setFormData] = useState({
    password: "",
  });

  const { auth, setAuth, setIsAuth, setUserEmail, setUsername } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.delete("/user/delete", {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        data: {
          password: formData.password,
        },
      });
      if (res.data.status) {
        prompt(
          "Account deleted. Please save this string: ",
          res.data.tokenisedData
        );
        localStorage.clear();
        setIsAuth(false);
        setUserEmail("");
        setUsername("");
        setAuth("");
        navigate("/");
      } else alert("Wrong password");
    } catch (error) {
      console.error(error);
      alert("Failed!");
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        margin={"0px"}
        backgroundColor={"#8540b3"}
        color={"#DDD2F7"}
      >
        Delete account
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
            <ModalHeader>Delete account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
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
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default Delete;

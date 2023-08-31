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

import isValidEmail from "../helpers/emailValidator";

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setAuth, setIsAuth, setUserEmail, setName, setUsername } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail(formData.email)) {
      try {
        const response = await axios.post("/user/login", { formData }, {});
        const token = response.data.accessToken;
        setAuth(token);
        setIsAuth(true);
        setName(response.data.name);
        setUsername(response.data.username);
        setUserEmail(response.data.userEmail);
        navigate("/home");
      } catch (error) {
        console.error(error);
        alert("Failed!");
      }
    } else {
      alert("Invalid email address");
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        margin={"10px"}
        backgroundColor={"#8540b3"}
        color={"#DDD2F7"}
      >
        Login
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
            <ModalHeader>Login</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </FormControl>

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
                Login
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default Login;

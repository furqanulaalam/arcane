import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";

import axios from "axios";

import isValidEmail from "../helpers/emailValidator";

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

const Register = () => {
  console.log(process.env);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    birthdate: "",
    password: "",
    confirmedPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password.length >= 8 &&
      formData.password === formData.confirmedPassword &&
      isValidEmail(formData.email) &&
      !formData.username.includes("@")
    ) {
      formData.username =
        formData.username + "@" + process.env.REACT_APP_SERVER_URL;
      const response = await axios.post("/user/register", { formData });
      if (response.data.exists) alert("User already exists!");
      else if (response.status === 200) alert("User registered!");
      else alert("Operation failed!");
    } else {
      alert("Invalid credentials!");
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
        Register
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
            <ModalHeader>Create your account</ModalHeader>
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
                  name="email"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Name</FormLabel>
                <Input
                  placeholder="Name"
                  required
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Username</FormLabel>
                <Input
                  placeholder="Username"
                  required
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Birthdate</FormLabel>
                <Input
                  placeholder="Birthdate"
                  type="date"
                  required
                  value={formData.birthdate}
                  name="birthdate"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Password"
                  type="password"
                  required
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  required
                  value={formData.confirmedPassword}
                  name="confirmedPassword"
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
                Register
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default Register;

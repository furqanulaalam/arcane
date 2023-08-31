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

const ServerRegister = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serverURL: "",
    serverName: "",
    key: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail(formData.email)) {
      const response = await axios.post("/server", { formData });
      if (response.data.exists) alert("Server already registered!");
      else if (response.status === 200) prompt("Access Key: ", response.data);
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
        backgroundColor={"#361969"}
        color={"#DDD2F7"}
      >
        Request Access
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
            <ModalHeader>Request Access</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Owner Email</FormLabel>
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
                <FormLabel mt={4}>Owner Name</FormLabel>
                <Input
                  placeholder="Name"
                  required
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Owner Server Key</FormLabel>
                <Input
                  placeholder="Owner Server Key"
                  required
                  value={formData.key}
                  name="key"
                  onChange={handleChange}
                  type="password"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Server URL</FormLabel>
                <Input
                  placeholder="Server URL"
                  required
                  value={formData.serverURL}
                  name="serverURL"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Server Name</FormLabel>
                <Input
                  placeholder="Server Name"
                  required
                  value={formData.serverName}
                  name="serverName"
                  onChange={handleChange}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                backgroundColor={"#361969"}
                color="#ddd2f7"
                mr={3}
                type="submit"
              >
                Request
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ServerRegister;

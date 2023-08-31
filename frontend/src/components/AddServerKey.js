import React, { useState } from "react";
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

const AddServerKey = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [formData, setFormData] = useState({
    serverURL: "",
    friendKey: "",
    ownKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("/server/key", { formData });
    if (response.data.exists) alert("Key already added!");
    else if (response.status === 200) alert("Key added!");
    else alert("Operation failed!");
  };
  return (
    <>
      <Button
        onClick={onOpen}
        margin={"10px"}
        backgroundColor={"#361969"}
        color={"#DDD2F7"}
      >
        Add Friend Key
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
            <ModalHeader>Add Friend Key</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
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

              <FormControl>
                <FormLabel mt={4}>Friend Server Key</FormLabel>
                <Input
                  placeholder="Friend Server Key"
                  required
                  value={formData.friendKey}
                  name="friendKey"
                  onChange={handleChange}
                  type="password"
                />
              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Own Server Key</FormLabel>
                <Input
                  placeholder="Own Server Key"
                  required
                  value={formData.ownKey}
                  name="ownKey"
                  onChange={handleChange}
                  type="password"
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
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default AddServerKey;

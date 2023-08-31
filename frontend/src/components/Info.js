import React from "react";
import { useDisclosure } from "@chakra-ui/react";

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const Info = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Button
        onClick={onOpen}
        margin={"10px"}
        backgroundColor={"#361969"}
        color={"#DDD2F7"}
      >
        Info
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent backgroundColor={"black"} color={"white"}>
          <ModalHeader>Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              Server name: Arcane.
              <br />
              Server url: arcane.com.
              <br />
              Server owner: Furkan Nul Aalam.
              <br />
              Owner email: furqan.ul.aalam@gmail.com.
              <br />
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Info;

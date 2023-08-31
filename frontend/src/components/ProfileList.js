import React, { useEffect, useContext, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";

import axios from "axios";

import {
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import AuthContext from "../context/AuthProvider";

const ProfileList = ({ type, targetUsername, changer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profileList, setProfileList] = useState([]);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { auth } = useContext(AuthContext);
  const onSubmit = () => {
    if (changer) changer();
  };
  useEffect(() => {
    axios
      .get(`/user/list/${targetUsername}&${type}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileList(
          response.data.map((user, i) => {
            return (
              <ListItem key={i}>
                <Link to={`/search/${user}`} onClick={onSubmit}>
                  {user}
                </Link>
              </ListItem>
            );
          })
        );
        console.log(profileList);
      });
  }, [targetUsername, type]);

  return (
    <>
      <Link onClick={onOpen}>{type}</Link>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent backgroundColor={"black"} color={"white"}>
          <ModalHeader>{type}</ModalHeader>
          <List>{profileList}</List>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileList;

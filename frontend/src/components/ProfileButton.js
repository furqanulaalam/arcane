import React, { useContext } from "react";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthProvider";

import axios from "axios";

const ProfileButton = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("#fff", "#1a202c");
  const textColor = useColorModeValue("#1a202c", "#fff");
  const { auth, setAuth, setIsAuth, setUsername, setUserEmail, setName } =
    useContext(AuthContext);

  const handleLogout = async () => {
    // Handle logout logic here
    const res = await axios.delete("/user/logout", {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });

    if (res.data) {
      setAuth("");
      setUserEmail("");
      setUsername("");
      setName("");
      setIsAuth(false);

      localStorage.clear();

      navigate("/");
    }
  };

  return (
    <Box position="absolute" right="15px">
      <Menu>
        <MenuButton
          as={IconButton}
          icon={
            <Avatar
              size="sm"
              bg={bgColor}
              color={textColor}
              icon={<FaUserCircle />}
            />
          }
          variant="ghost"
        />
        <MenuList bg={"black"}>
          <MenuItem as={Link} to="/profile" bg={"black"}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} bg={"black"}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default ProfileButton;

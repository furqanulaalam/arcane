import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Text, Heading } from "@chakra-ui/react";

import LoginRegisterHolder from "./LoginRegisterHolder";
import ServerRegister from "./ServerRegister";
import FriendServer from "./FriendServer";
import AddServerKey from "./AddServerKey";
import Info from "./Info";

import AuthContext from "../context/AuthProvider";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);
  const stringToBoolean = (boolInString) => {
    if (typeof boolInString === "boolean") return boolInString;
    if (boolInString === "true") return true;
    else return false;
  };
  useEffect(() => {
    if (stringToBoolean(isAuth)) navigate("/home");
  }, []);
  return (
    <Box>
      <Heading as="h2" size="3xl">
        arcane
      </Heading>
      <Text fontSize="3xl" marginTop={"10px"}>
        a decentralised social network for the future
      </Text>
      <Text fontSize="xl" marginTop={"5px"}>
        powered by IPFS
      </Text>
      <FriendServer />
      <ServerRegister />
      <AddServerKey />
      <Info />
      <LoginRegisterHolder />
    </Box>
  );
};

export default Landing;

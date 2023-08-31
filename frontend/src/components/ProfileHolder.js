import { Box, Heading } from "@chakra-ui/react";

import Profile from "./Profile";
import ProfileSearcher from "./ProfileSearcher";
import ProfileButton from "./ProfileButton";
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

const ProfileHolder = () => {
  const { name, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const stringToBoolean = (boolInString) => {
    if (typeof boolInString === "boolean") return boolInString;
    if (boolInString === "true") return true;
    else return false;
  };

  useEffect(() => {
    if (!stringToBoolean(isAuth)) {
      navigate("/");
    }
  }, []);

  return (
    <Box
      margin={"auto"}
      backgroundColor={"black"}
      width={"50%"}
      height={"100vh"}
    >
      {stringToBoolean(isAuth) && (
        <div>
          <ProfileButton />
          <Heading
            as="h2"
            size="3xl"
            color={"#ddd2f7"}
            textAlign={"center"}
            marginBottom={"80px"}
          >
            <Link to="/home">arcane</Link>
          </Heading>
          <ProfileSearcher />
          <Profile name={name} changer={null} />
        </div>
      )}
    </Box>
  );
};

export default ProfileHolder;

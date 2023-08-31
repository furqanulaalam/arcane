import AuthContext from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { Box, Heading } from "@chakra-ui/react";

import OtherProfile from "./OtherProfile";
import ProfileSearcher from "./ProfileSearcher";
import Follow from "./Follow";

import ProfileButton from "./ProfileButton";

const OtherProfileHolder = () => {
  const navigate = useNavigate();
  const { auth, username, isAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [change, setChange] = useState(0);
  const [blocker, setBlocker] = useState(false);
  let { targetUsername } = useParams();
  const stringToBoolean = (boolInString) => {
    if (typeof boolInString === "boolean") return boolInString;
    if (boolInString === "true") return true;
    else return false;
  };

  useEffect(() => {
    if (!stringToBoolean(isAuth)) navigate("/");
    else {
      axios
        .get(`/user/blocker/${targetUsername}&${username}`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setBlocker(response.data.blocker);
        });

      axios
        .get(`/user/profile/${targetUsername}`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        })
        .then((response) => {
          setName(response.data.name);
        });
    }
  }, [change]);
  const changer = () => {
    setChange(!change);
  };
  return (
    <Box
      margin={"auto"}
      backgroundColor={"black"}
      width={"50%"}
      height={"100vh"}
    >
      {stringToBoolean(isAuth) && (
        <div>
          {" "}
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
          <ProfileSearcher changer={changer} />
          {blocker ? (
            <Box textAlign="center" marginTop={"100px"}>
              {targetUsername} has blocked you.
            </Box>
          ) : (
            <OtherProfile
              name={name}
              targetUsername={targetUsername}
              changer={changer}
            >
              {username != targetUsername ? (
                <Follow targetUsername={targetUsername} />
              ) : null}
            </OtherProfile>
          )}
        </div>
      )}
    </Box>
  );
};

export default OtherProfileHolder;

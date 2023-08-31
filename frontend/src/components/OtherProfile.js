import { useContext } from "react";

import { Box, Image, Heading, Grid, GridItem, Center } from "@chakra-ui/react";

import OtherProfilePostsHolder from "./OtherProfilePostsHolder";
import ProfileList from "./ProfileList";
import Block from "./Block";

import AuthContext from "../context/AuthProvider";

const OtherProfile = (props) => {
  const { username } = useContext(AuthContext);
  return (
    <Box padding={"20px"}>
      <Box>
        <Image
          src={`/user/avatar/${props.targetUsername}`}
          alt="Dan Abramov"
          height={"200px"}
          width={"200px"}
          textAlign={"center"}
        />
      </Box>
      <Heading
        as="h2"
        size="xl"
        color={"#ddd2f7"}
        marginTop={"20px"}
        marginBottom={"40px"}
      >
        {props.name}
      </Heading>
      {props.children}
      {username !== props.targetUsername && (
        <Block targetUsername={props.targetUsername} />
      )}
      <Box>
        <Grid templateColumns="repeat(2, 1fr)" gap="4" mt="4">
          <GridItem>
            <Center>
              <ProfileList
                type="Following"
                targetUsername={props.targetUsername}
                changer={props.changer}
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <ProfileList
                type="Followers"
                targetUsername={props.targetUsername}
                changer={props.changer}
              />
            </Center>
          </GridItem>
        </Grid>
      </Box>
      <OtherProfilePostsHolder targetUsername={props.targetUsername} />
    </Box>
  );
};

export default OtherProfile;

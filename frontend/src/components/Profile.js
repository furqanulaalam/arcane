import { Box, Image, Heading, Grid, GridItem, Center } from "@chakra-ui/react";

import ProfilePostsHolder from "./ProfilePostsHolder";
import ProfileList from "./ProfileList";
import ProfilePictureButton from "./ProfilePictureButton";
import Delete from "./Delete";

import AuthContext from "../context/AuthProvider";

import { useContext } from "react";

const Profile = ({ name, changer }) => {
  const { username } = useContext(AuthContext);

  return (
    <Box padding={"20px"} width={"100%"}>
      <Box>
        <Image
          src={`/user/avatar/${username}`}
          alt={name}
          height={"170px"}
          width={"170px"}
          textAlign={"center"}
          borderRadius={"50%"}
        />
        <ProfilePictureButton />
      </Box>
      <Heading
        as="h2"
        size="xl"
        color={"#ddd2f7"}
        marginTop={"20px"}
        marginBottom={"40px"}
      >
        {name}
      </Heading>
      <Delete />
      <Box>
        <Grid templateColumns="repeat(2, 1fr)" gap="4" mt="4">
          <GridItem>
            <Center>
              <ProfileList
                type="Following"
                targetUsername={username}
                changer={changer}
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <ProfileList
                type="Followers"
                targetUsername={username}
                changer={changer}
              />
            </Center>
          </GridItem>
        </Grid>
      </Box>

      <ProfilePostsHolder />
    </Box>
  );
};

export default Profile;

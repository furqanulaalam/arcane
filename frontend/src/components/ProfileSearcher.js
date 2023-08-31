import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  List,
  ListItem,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

import axios from "axios";

import AuthContext from "../context/AuthProvider";

// Mock data for user search results

const ProfileSearcher = ({ changer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const { auth } = useContext(AuthContext);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter users by search term
    axios
      .get(`/user/profile/${value}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Box position="relative" width="50%" m={"auto"}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FaSearch} color="gray.500" />}
        />
        <Input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearch}
          bg="gray.100"
          color="gray.900"
        />
      </InputGroup>

      {searchTerm && (
        <Box
          position="absolute"
          zIndex="1"
          top="40px"
          width="100%"
          bg="white"
          boxShadow="lg"
          color={"black"}
        >
          <List>
            <ListItem key={1} p="2" _hover={{ bg: "gray.100" }}>
              {searchResults.targetUsername ? (
                <Link
                  to={`/search/${searchResults.targetUsername}`}
                  color="black"
                  onClick={changer}
                >
                  {searchResults.name}
                </Link>
              ) : null}
            </ListItem>
          </List>
          <Divider />
        </Box>
      )}
    </Box>
  );
};

export default ProfileSearcher;

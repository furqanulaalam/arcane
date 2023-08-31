import { useState, useEffect, useContext } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const Block = ({ targetUsername }) => {
  const { auth } = useContext(AuthContext);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check if user is following the target user
    axios
      .get(
        `/user/blocked/${targetUsername}`,

        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      )
      .then((response) => {
        setIsBlocked(response.data.isBlocked);
      });
  }, [targetUsername]);

  const handleBlock = () => {
    if (isBlocked) {
      // Unfollow the target user
      axios
        .post(
          `/user/blocked`,
          { targetUsername },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              withCredentials: true,
            },
          }
        )
        .then((response) => {
          const result = response.data.status === true ? false : true;
          setIsBlocked(result);
          window.location.reload();
        });
    } else {
      // Follow the target user
      axios
        .post(
          `/user/blocked`,
          { targetUsername },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              withCredentials: true,
            },
          }
        )
        .then((response) => {
          setIsBlocked(response.data.status);
          window.location.reload();
        });
    }
  };

  return (
    <Button bg={"#8540b3"} onClick={handleBlock} marginLeft={"40px"}>
      {isBlocked ? "Unblock" : "Block"}
    </Button>
  );
};

export default Block;

import { useState, useEffect, useContext } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const Follow = ({ targetUsername }) => {
  const { auth, username } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    // Check if user is following the target user
    axios
      .get(
        `/user/blocked/${targetUsername}`,

        {
          params: { username },
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      )
      .then((response) => {
        setIsBlocked(response.data.isBlocked);
        if (!isBlocked) {
          axios
            .get(
              `/user/following/${targetUsername}`,

              {
                params: { username },
                headers: {
                  Authorization: `Bearer ${auth}`,
                },
              }
            )
            .then((response) => {
              setIsFollowing(response.data.isFollowing);
            });
        }
      });
  }, [targetUsername]);

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow the target user
      axios
        .post(
          `/user/unfollow`,
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
          setIsFollowing(result);
        });
    } else {
      // Follow the target user
      axios
        .post(
          `/user/follow`,
          { targetUsername },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              withCredentials: true,
            },
          }
        )
        .then((response) => {
          setIsFollowing(response.data.status);
        });
    }
  };

  return (
    !isBlocked && (
      <Button bg={"#8540b3"} onClick={handleFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    )
  );
};

export default Follow;

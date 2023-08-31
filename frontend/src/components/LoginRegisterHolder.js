import { Box } from "@chakra-ui/react";

import Login from "./Login";
import Register from "./Register";
import RegisterWithToken from "./RegisterWithToken";

const LoginRegisterHolder = () => {
  return (
    <Box className="loginRegisterHolder">
      <Register />
      <RegisterWithToken />
      <Login />
    </Box>
  );
};

export default LoginRegisterHolder;

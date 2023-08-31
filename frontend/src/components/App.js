import "../App.css";

import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { AuthProvider } from "../context/AuthProvider";

import Landing from "./Landing";
import Footer from "./Footer";
import PostsHolder from "./PostsHolder";
import ProfileHolder from "./ProfileHolder";
import OtherProfileHolder from "./OtherProfileHolder";

function App() {
  return (
    <AuthProvider>
      <Box className="App" margin={"40px"} color={"#ddd2f7"} height={"100vh"}>
        <Routes>
          <Route path="/" element={<Landing />} exact />
          <Route path="/profile" element={<ProfileHolder />} exact />
          <Route path="/home" element={<PostsHolder />} exact />
          <Route
            path="/search/:targetUsername"
            element={<OtherProfileHolder />}
            exact
          />
        </Routes>
        <Footer />
      </Box>
    </AuthProvider>
  );
}

export default App;

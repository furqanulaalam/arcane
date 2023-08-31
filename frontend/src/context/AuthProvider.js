import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem("auth") || "");
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    localStorage.setItem("auth", auth);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("isAuth", isAuth);
    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
  }, [auth, userEmail, isAuth, name, username]);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isAuth,
        setIsAuth,
        userEmail,
        setUserEmail,
        name,
        setName,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

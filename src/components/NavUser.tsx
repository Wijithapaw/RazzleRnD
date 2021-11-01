import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

const NavUser = () => {
  const history = useHistory();

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    setLoggedIn(!!authToken);
  }, []);

  const handleSignOut = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("AUTH_TOKEN");
    setLoggedIn(false);
  };

  const handleSignIn = (e: any) => {
    e.preventDefault();
    //history.push("/login");
    window.location.replace("/login")
  };

  return isLoggedIn ? (
    <a href="/" onClick={handleSignOut}>
      Sign out
    </a>
  ) : (
    <a href="/" onClick={handleSignIn}>
      Sign In
    </a>
  );
};

export default NavUser;

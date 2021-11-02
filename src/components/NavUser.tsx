import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { cookieStorageService } from "../services/cookie-storage.service";
import { storageService } from "../services/storage.service";

const NavUser = () => {
  const history = useHistory();

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = storageService.getItem("AUTH_TOKEN");
    setLoggedIn(!!authToken);
  }, []);

  const handleSignOut = (e: any) => {
    e.preventDefault();

    storageService.clearItem("AUTH_TOKEN");
    cookieStorageService.clearItem("USER_ID");

    window.location.replace("/");
  };

  const handleSignIn = (e: any) => {
    e.preventDefault();
    //history.push("/login");
    window.location.replace("/login");
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

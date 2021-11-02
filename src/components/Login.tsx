import React, { useState } from "react";
import { authService } from "../services/auth.services";
import { cookieStorageService } from "../services/cookie-storage.service";
import { storageService } from "../services/storage.service";

const Login = () => {
  const [username, setUsername] = useState("kandyadmin@yopmail.com");
  const [password, setPassword] = useState("Pwd123");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    authService
      .login(username, password)
      .then((result: any) => {
        if (result.succeeded) {
          storageService.setItem("AUTH_TOKEN", result.authToken);
          cookieStorageService.setItem("USER_ID", result.user.id);
          if (result.defaultTenant)
            cookieStorageService.setItem("TENANT", result.defaultTenant);

          window.location.replace("/");
        } else {
          alert("Invalid login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <span>Username: </span>
      <input
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <span>Password: </span>
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;

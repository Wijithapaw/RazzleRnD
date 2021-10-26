import React, { useState } from "react";
import { useHistory } from "react-router";
import { authService } from "../services/auth.services";

const Login = () => {
  const [username, setUsername] = useState("ace.abz@gmail.comtest");
  const [password, setPassword] = useState("Pwd123");

  const history = useHistory();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ username, password });
    authService
      .login(username, password)
      .then((result: any) => {
        console.log(result);
        if (result.succeeded) {
          localStorage.setItem("AUTH_TOKEN", result.authToken);
          history.push("/");
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

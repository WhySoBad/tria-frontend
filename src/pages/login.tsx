import { NextPage } from "next";
import React from "react";
import Login from "../components/Login/Login";

const LoginPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title>Login</title>
      <Login />
    </>
  );
};

export default LoginPage;

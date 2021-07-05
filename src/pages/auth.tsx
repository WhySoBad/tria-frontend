import { NextPage } from "next";
import React from "react";
import Auth from "../components/Auth/Auth";

const AuthPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title>Auth</title>
      <Auth />
    </>
  );
};

export default AuthPage;

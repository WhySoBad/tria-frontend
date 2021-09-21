import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../components/Layout";
import Login from "../components/Login";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const LoginPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout small>
      <Meta description="Login to start chatting" title={translation.sites.login} keywords={["login"]} />
      <Login />
    </FormLayout>
  );
};

export default LoginPage;

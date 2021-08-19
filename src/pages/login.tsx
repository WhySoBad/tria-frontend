import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../components/Layout/Layout";
import Login from "../components/Login/Login";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

const LoginPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout small>
      <Meta description="Login to start chatting" title={translation.sites.login} />
      <Login />
    </FormLayout>
  );
};

export default LoginPage;

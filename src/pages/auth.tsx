import { NextPage } from "next";
import React from "react";
import Auth from "../components/Auth";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const AuthPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <>
      <Meta noindex description={"Authentificate user access"} title={translation.sites.auth} />
      <Auth />
    </>
  );
};

export default AuthPage;

import { NextPage } from "next";
import React from "react";
import Auth from "../components/Auth/Auth";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

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

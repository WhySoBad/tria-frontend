import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import SignUp from "../components/SignUp/SignUp";
import { useLang } from "../hooks/LanguageContext";

const SignUpPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout small>
      <SignUp />
      <Meta description="Create an account to start chatting with other people all over the world" title={translation.sites.signup} keywords={["register", "new account", "signup"]} />
    </FormLayout>
  );
};

export default SignUpPage;

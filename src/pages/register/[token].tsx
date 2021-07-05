import { NextPage, NextPageContext } from "next";
import React from "react";
import { validateRegister } from "client";

interface Props {
  token?: string;
}

const RegisterSetupPage: NextPage<Props> = ({ token }): JSX.Element => {
  return (
    <>
      <title>Register</title>
    </>
  );
};

RegisterSetupPage.getInitialProps = async (context: NextPageContext) => {
  const token: string = (context.query.token as string) || "";
  const valid: boolean = await validateRegister(token);
  if (!valid) {
    context.res?.writeHead(302, { Location: "/register" });
    context.res?.end();
  } else return { token: token };
};

export default RegisterSetupPage;

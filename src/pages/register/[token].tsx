import { NextPage, NextPageContext } from "next";
import React from "react";
import { validateRegister } from "client";
import { FormLayout } from "../../components/Layout/Layout";
import Register from "../../components/Register/Register";

const RegisterPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title>Register</title>
      <FormLayout children={<Register />} />
    </>
  );
};

RegisterPage.getInitialProps = async (context: NextPageContext) => {
  const token: string = (context.query?.token as string) || "";
  const valid: boolean = await validateRegister(token);
  if (!valid) {
    context.res.writeHead(301, {
      Location: "/",
    });
    context.res.end();
  }
  return { token: token };
};

export default RegisterPage;

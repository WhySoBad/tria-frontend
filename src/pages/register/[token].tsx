import { validateRegister } from "client";
import { NextPage, NextPageContext } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout/Layout";
import Meta from "../../components/Meta/Meta";
import Register from "../../components/Register/Register";
import { useLang } from "../../hooks/LanguageContext";

const RegisterPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <Register />
      <Meta noindex description="Finish your account registration" title={translation.sites.register} />
    </FormLayout>
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

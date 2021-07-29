import { NextPage, NextPageContext } from "next";
import React from "react";
import { validatePasswordReset } from "client";
import { FormLayout } from "../../components/Layout/Layout";
import PasswordResetConfirm from "../../components/PasswordReset/PasswordResetConfirm";

interface Props {
  token?: string;
}

const PasswordResetPage: NextPage<Props> = ({ token }): JSX.Element => {
  return (
    <>
      <title>Reset Password</title>
      <FormLayout children={<PasswordResetConfirm token={token} />} />
    </>
  );
};

PasswordResetPage.getInitialProps = async (context: NextPageContext) => {
  const token: string = (context.query?.token as string) || "";
  const valid: boolean = await validatePasswordReset(token);
  if (!valid) {
    context.res.writeHead(301, {
      Location: "/passwordreset",
    });
    context.res.end();
  } else return { token: token };
};

export default PasswordResetPage;

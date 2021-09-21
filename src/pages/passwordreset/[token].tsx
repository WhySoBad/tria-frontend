import { validatePasswordReset } from "client";
import { NextPage, NextPageContext } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout";
import Meta from "../../components/Meta";
import PasswordResetConfirm from "../../components/PasswordResetConfirm";
import { useLang } from "../../hooks";

interface Props {
  token?: string;
}

const PasswordResetPage: NextPage<Props> = ({ token }): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <PasswordResetConfirm token={token} />
      <Meta noindex description="Finish your password reset by setting a new password" title={translation.sites.passwordreset_confirm} />
    </FormLayout>
  );
};

PasswordResetPage.getInitialProps = async (context: NextPageContext) => {
  const token: string = (context.query?.token as string) || "";
  const valid: boolean = await validatePasswordReset(token);
  if (!valid) {
    context.res.writeHead(301, { Location: "/passwordreset" });
    context.res.end();
  } else return { token: token };
};

export default PasswordResetPage;

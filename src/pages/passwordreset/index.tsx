import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout";
import Meta from "../../components/Meta";
import PasswordReset from "../../components/PasswordReset";
import { useLang } from "../../hooks";

const PasswordResetPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <PasswordReset />
      <Meta description="Reset your password" title={translation.sites.passwordreset} />
    </FormLayout>
  );
};

export default PasswordResetPage;

import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout/Layout";
import Meta from "../../components/Meta/Meta";
import PasswordReset from "../../components/PasswordReset/PasswordReset";
import { useLang } from "../../hooks/LanguageContext";

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

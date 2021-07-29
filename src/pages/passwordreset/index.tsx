import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout/Layout";
import PasswordReset from "../../components/PasswordReset/PasswordReset";

const PasswordResetPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title children={"Reset Password"} />
      <FormLayout children={<PasswordReset />} />
    </>
  );
};

export default PasswordResetPage;

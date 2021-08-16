import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../../components/Layout/Layout";
import PasswordReset from "../../components/PasswordReset/PasswordReset";

const PasswordResetPage: NextPage = (): JSX.Element => <FormLayout children={<PasswordReset />} />;

export default PasswordResetPage;

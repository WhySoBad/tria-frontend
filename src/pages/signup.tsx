import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../components/Layout/Layout";
import SignUp from "../components/SignUp/SignUp";

const SignUpPage: NextPage = (): JSX.Element => <FormLayout small children={<SignUp />} />;

export default SignUpPage;

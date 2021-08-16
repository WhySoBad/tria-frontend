import { NextPage } from "next";
import React from "react";
import { FormLayout } from "../components/Layout/Layout";
import Login from "../components/Login/Login";

const LoginPage: NextPage = (): JSX.Element => <FormLayout small children={<Login />} />;

export default LoginPage;

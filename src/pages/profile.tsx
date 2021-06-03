import { NextPage } from "next";
import React from "react";
import Layout from "../components/Layout/Layout";
import Profile from "../components/Profile/Profile";

const ProfilePage: NextPage = (): JSX.Element => {
  return (
    <>
      <title>Profile</title>
      <Layout children={<Profile />} />
    </>
  );
};

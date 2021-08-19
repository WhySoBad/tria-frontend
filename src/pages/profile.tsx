import { NextPage } from "next";
import React from "react";
import Layout from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import Profile from "../components/Profile/Profile";
import { useLang } from "../hooks/LanguageContext";

const ProfilePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta noindex description="Edit your profile, see in which chats you are or delete your account" title={translation.sites.profile} />
      <Profile />
    </Layout>
  );
};

export default ProfilePage;

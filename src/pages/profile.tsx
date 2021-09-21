import { NextPage } from "next";
import React from "react";
import Layout from "../components/Layout";
import Meta from "../components/Meta";
import Profile from "../components/Profile";
import { useClient, useLang } from "../hooks";

const ProfilePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  const { client } = useClient();
  const name: string = client ? client.user.name : ""; //name of the logged in user

  return (
    <Layout>
      <Meta noindex description="Edit your profile, see in which chats you are or delete your account" title={`${translation.sites.profile} ${name}`} />
      <Profile />
    </Layout>
  );
};

export default ProfilePage;

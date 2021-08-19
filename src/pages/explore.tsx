import { NextPage } from "next";
import React from "react";
import Explore from "../components/Explore/Explore";
import Layout from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

const ExplorePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta description="Find new users and groups to chat" title={translation.sites.explore} />
      <Explore />
    </Layout>
  );
};

export default ExplorePage;

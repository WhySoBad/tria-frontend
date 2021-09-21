import { NextPage } from "next";
import React from "react";
import Explore from "../components/Explore";
import Layout from "../components/Layout";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const ExplorePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta noindex description="Find new users and groups to chat" title={translation.sites.explore} />
      <Explore />
    </Layout>
  );
};

export default ExplorePage;

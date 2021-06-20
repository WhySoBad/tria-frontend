import { NextPage } from "next";
import React from "react";
import Explore from "../../components/Explore/Explore";
import Layout from "../../components/Layout/Layout";

const ExplorePage: NextPage = (): JSX.Element => {
  return (
    <>
      <title>Explore Chat</title>
      <Layout children={<Explore type={"CHAT"} />} />
    </>
  );
};

export default ExplorePage;

import { NextPage } from "next";
import React from "react";
import Create from "../components/Create";
import Layout from "../components/Layout";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const CreatePage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <Layout>
      <Meta noindex description="Create a new group to chat with other people" title={translation.sites.create} />
      <Create />
    </Layout>
  );
};

export default CreatePage;

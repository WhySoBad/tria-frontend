import { NextPage } from "next";
import React from "react";
import Create from "../components/Create/Create";
import Layout from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

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

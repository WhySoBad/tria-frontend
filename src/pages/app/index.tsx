import React from "react";
import { NextPage } from "next";
import { useClient } from "../../hooks/ClientContext";
import withAuth from "../../hooks/WithAuth";
import Home from "../../components/Home/Home";
import Layout from "../../components/Layout/Layout";

const AppPage: NextPage = (): JSX.Element => {
  const { client } = useClient();

  if (!client) return <></>;

  return (
    <>
      <title children={"Home"} />
      <Layout children={<Home />} />
    </>
  );
};

export const getServerSideProps = withAuth();

export default AppPage;

import React from "react";
import { NextPage } from "next";
import withAuth from "../../hooks/WithAuth";
import Layout from "../../components/Layout/Layout";

const AppPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title children={"Home"} />
      <Layout />
    </>
  );
};

export const getServerSideProps = withAuth();

export default AppPage;

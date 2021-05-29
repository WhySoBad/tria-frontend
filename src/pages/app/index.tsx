import React from "react";
import { NextPage } from "next";
import { useClient } from "../../hooks/ClientContext";
import withAuth from "../../hooks/WithAuth";
import Chat from "../../components/Chat/Chat";

const AppPage: NextPage = (): JSX.Element => {
  const { client } = useClient();

  if (!client) return <></>;

  return (
    <>
      <title children={"Home"} />
      <Chat />
    </>
  );
};

export const getServerSideProps = withAuth();

export default AppPage;

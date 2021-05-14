import React from "react";
import { NextPage } from "next";
import { useClient } from "../../hooks/ClientContext";
import withAuth from "../../hooks/WithAuth";
import Home from "../../components/Home/Home";
import { ChatProvider } from "../../hooks/ChatContext";
import Chat from "../../components/Chat/Chat";

const AppPage: NextPage = (): JSX.Element => {
  const { client } = useClient();

  if (!client) return <></>;

  return <Chat />;
};

export const getServerSideProps = withAuth();

export default AppPage;

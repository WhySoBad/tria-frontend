import { NextPage, NextPageContext } from "next";
import React, { useEffect } from "react";
import Chat from "../../components/Chat/Chat";
import Layout from "../../components/Layout/Layout";
import { useChat } from "../../hooks/ChatContext";

interface Props {
  chat?: string;
}

const ChatPage: NextPage<Props> = ({ chat }): JSX.Element => {
  const { setSelected } = useChat();

  useEffect(() => {
    setSelected(chat);
  }, [chat]);

  return (
    <>
      <Layout children={<Chat />} />
    </>
  );
};

ChatPage.getInitialProps = async (context: NextPageContext) => {
  const uuid: string = (context.query?.uuid as string) || "";
  const uuidRegex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  if (typeof uuid == "string" && uuidRegex.test(uuid)) {
    return { chat: uuid };
  } else return { chat: undefined, name: undefined }; //TODO: redirect
};

export default ChatPage;

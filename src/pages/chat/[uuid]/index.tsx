import { Chat, Group, PrivateChat } from "client";
import { NextPage, NextPageContext } from "next";
import React, { useEffect } from "react";
import ChatComponent from "../../../components/Chat/Chat";
import Layout from "../../../components/Layout/Layout";
import Meta from "../../../components/Meta/Meta";
import { useChat } from "../../../hooks/ChatContext";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";

interface Props {
  uuid?: string;
}

const ChatPage: NextPage<Props> = ({ uuid }): JSX.Element => {
  const { setSelected } = useChat();
  const { client } = useClient();
  const { translation } = useLang();

  useEffect(() => {
    setSelected(uuid);
  }, [uuid]);

  const chat: Chat | undefined = client?.user?.chats?.get(uuid);
  const name: string = chat instanceof PrivateChat ? chat.participant.user.name : chat instanceof Group ? chat.name : "";
  const avatar: string | null = chat instanceof PrivateChat ? chat.participant.user.avatarURL : chat instanceof Group ? chat.avatarURL : null;

  return (
    <Layout>
      <Meta noindex description="A chat to write with other people" title={`${translation.sites.chat} ${name}`} image={avatar} />
      <ChatComponent uuid={uuid} />
    </Layout>
  );
};

ChatPage.getInitialProps = async (context: NextPageContext) => {
  const uuid: string = (context.query?.uuid as string) || "";
  const uuidRegex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  if (typeof uuid == "string" && uuidRegex.test(uuid)) {
    return { uuid: uuid };
  } else {
    context.res.writeHead(301, {
      Location: "/app",
    });
    context.res.end();
  }
};

export default ChatPage;

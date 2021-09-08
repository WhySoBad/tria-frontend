import { Chat, Group, PrivateChat } from "client";
import { NextPage, NextPageContext } from "next";
import React, { useEffect } from "react";
import ChatSettings from "../../../components/Chat/ChatSettings";
import Layout from "../../../components/Layout";
import Meta from "../../../components/Meta";
import { useChat } from "../../../hooks/ChatContext";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";

interface Props {
  uuid?: string;
}

const ChatSettingsPage: NextPage<Props> = ({ uuid }): JSX.Element => {
  const { setSelected } = useChat();
  const { translation } = useLang();
  const { client } = useClient();

  useEffect(() => {
    setSelected(uuid);
  }, [uuid]);

  const chat: Chat | undefined = client?.user?.chats?.get(uuid);
  const name: string = chat instanceof PrivateChat ? chat.participant.user.name : chat instanceof Group ? chat.name : "";
  const avatar: string | null = chat instanceof PrivateChat ? chat.participant.user.avatarURL : chat instanceof Group ? chat.avatarURL : null;

  return (
    <Layout>
      <ChatSettings uuid={uuid} />
      <Meta noindex description="Edit a group or manage its members" title={`${translation.sites.chat_settings} ${name}`} image={avatar} />
    </Layout>
  );
};

ChatSettingsPage.getInitialProps = async (context: NextPageContext) => {
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

export default ChatSettingsPage;

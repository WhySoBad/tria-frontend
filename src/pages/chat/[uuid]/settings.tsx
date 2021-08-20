import { Chat, Group } from "client";
import { NextPage, NextPageContext } from "next";
import React, { useEffect } from "react";
import ChatSettings from "../../../components/Chat/ChatSettings";
import Layout from "../../../components/Layout/Layout";
import Meta from "../../../components/Meta/Meta";
import { useChat } from "../../../hooks/ChatContext";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";

interface Props {
  chat?: string;
}

const ChatSettingsPage: NextPage<Props> = ({ chat }): JSX.Element => {
  const { setSelected } = useChat();
  const { translation } = useLang();
  const { client } = useClient();

  useEffect(() => {
    setSelected(chat);
  }, [chat]);

  const group: Chat | undefined = client.user.chats.get(chat);
  if (!group || !(group instanceof Group)) return <></>;

  return (
    <Layout>
      <ChatSettings chat={group} />
      <Meta noindex description="Edit a group or manage its members" title={`${translation.sites.chat_settings} ${group.name}`} image={group.avatarURL} />
    </Layout>
  );
};

ChatSettingsPage.getInitialProps = async (context: NextPageContext) => {
  const uuid: string = (context.query?.uuid as string) || "";
  const uuidRegex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  if (typeof uuid == "string" && uuidRegex.test(uuid)) {
    return { chat: uuid };
  } else {
    context.res.writeHead(301, {
      Location: "/passwordreset",
    });
    context.res.end();
  }
};

export default ChatSettingsPage;

import { NextPage, NextPageContext } from "next";
import React, { useEffect } from "react";
import Chat from "../../../components/Chat/Chat";

interface Props {
  chat?: string;
}

const ChatPage: NextPage<Props> = ({ chat }): JSX.Element => {
  return (
    <>
      <title children={`Chat | ${chat}`} />
      <Chat uuid={chat} />
    </>
  );
};

ChatPage.getInitialProps = async (context: NextPageContext) => {
  const uuid: string = (context.query?.uuid as string) || "";
  const uuidRegex: RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  if (typeof uuid == "string" && uuidRegex.test(uuid)) {
    return { chat: uuid };
  } else return { chat: undefined }; //TODO: redirect
};

export default ChatPage;

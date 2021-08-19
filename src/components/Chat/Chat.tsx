import { Chat } from "client";
import React, { useEffect, useRef } from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Chat.module.scss";
import ChatInput from "./ChatInput";
import Messages from "./ChatMessages";
import ChatTitle from "./ChatTitle";

const ChatComponent: React.FC = (): JSX.Element => {
  const { selected } = useChat();
  const { client } = useClient();
  const ref = useRef<HTMLInputElement>(null);
  const chat: Chat | undefined = client.user.chats.get(selected);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0 });
  }, [selected]);

  if (!chat) return <></>;

  return (
    <>
      <div className={style["title-container"]} children={<ChatTitle />} />
      <div className={style["messages-container"]} ref={ref} children={<Messages />} />
      <ChatInput />
    </>
  );
};

export default ChatComponent;

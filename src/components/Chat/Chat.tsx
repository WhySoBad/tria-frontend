import React, { useEffect, useRef } from "react";
import { useChat } from "../../hooks/ChatContext";
import style from "../../styles/modules/Chat.module.scss";
import ChatInput from "./ChatInput";
import ChatTitle from "./ChatTitle";
import Messages from "./ChatMessages";

const Chat: React.FC = (): JSX.Element => {
  const { selected } = useChat();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0 });
  }, [selected]);

  return (
    <>
      <div className={style["title-container"]} children={<ChatTitle />} />
      <div className={style["messages-container"]} ref={ref} children={<Messages />} />
      <ChatInput />
    </>
  );
};

export default Chat;

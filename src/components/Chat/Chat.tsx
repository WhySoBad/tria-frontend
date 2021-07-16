import { ChatSocketEvent } from "client";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Chat.module.scss";
import ChatInput from "./ChatInput";
import ChatTitle from "./ChatTitle";
import Messages from "./ChatMessages";
import ChatSettings from "./ChatSettings";

const Chat: React.FC = (): JSX.Element => {
  const { selected } = useChat();
  const [view, setView] = useState<"CHAT" | "SETTINGS">("CHAT");

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setView("CHAT");
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0 });
  }, [selected]);

  return (
    <>
      <div className={style["title-container"]} children={<ChatTitle />} />
      {view === "CHAT" && (
        <>
          <div className={style["messages-container"]} ref={ref} children={<Messages />} />
          <ChatInput />
        </>
      )}
      {view === "SETTINGS" && <ChatSettings />}
    </>
  );
};

export default Chat;

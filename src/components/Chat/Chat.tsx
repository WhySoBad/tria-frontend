import { ChatSocketEvent } from "client";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Chat.module.scss";
import ChatInput from "./ChatInput";
import ChatTitle from "./ChatTitle";
import Messages from "./Messages";

const Chat: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected, update } = useChat();
  const [hasListeners, setListeners] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0 });
  }, [selected]);

  useEffect(() => {
    addListeners();
    return () => removeListeners();
  }, []);

  useEffect(() => {
    !hasListeners && addListeners();
    return () => removeListeners();
  }, [client]);

  const addListeners = (): void => {
    if (!client) return;
    setListeners(true);
    client.on(ChatSocketEvent.MESSAGE, update);
    client.on(ChatSocketEvent.MEMBER_BAN, update);
    client.on(ChatSocketEvent.MEMBER_JOIN, update);
    client.on(ChatSocketEvent.MEMBER_LEAVE, update);
    client.on(ChatSocketEvent.GROUP_CREATE, update);
    client.on(ChatSocketEvent.PRIVATE_CREATE, update);
    client.on(ChatSocketEvent.CHAT_EDIT, update);
    client.on(ChatSocketEvent.MEMBER_ONLINE, update);
    client.on(ChatSocketEvent.MEMBER_OFFLINE, update);
  };

  const removeListeners = (): void => {
    if (!client) return;
    client.off(ChatSocketEvent.MESSAGE, update);
    client.off(ChatSocketEvent.MEMBER_BAN, update);
    client.off(ChatSocketEvent.MEMBER_JOIN, update);
    client.off(ChatSocketEvent.MEMBER_LEAVE, update);
    client.off(ChatSocketEvent.GROUP_CREATE, update);
    client.off(ChatSocketEvent.PRIVATE_CREATE, update);
    client.off(ChatSocketEvent.CHAT_EDIT, update);
    client.off(ChatSocketEvent.MEMBER_ONLINE, update);
    client.off(ChatSocketEvent.MEMBER_OFFLINE, update);
  };

  return (
    <>
      <div className={style["title"]} children={<ChatTitle />} />
      <div className={style["messages-container"]} ref={ref} children={<Messages />} />
      <ChatInput />
    </>
  );
};

export default Chat;

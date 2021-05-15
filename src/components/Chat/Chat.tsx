import { ChatSocketEvent } from "client";
import React, { useEffect, useRef } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Chat.module.scss";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatTitle from "./ChatTitle";
import Messages from "./Messages";

interface ChatProps {}

const Chat: React.FC<ChatProps> = ({}): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();

  return (
    <main className={style["container"]}>
      <section className={style["chatlist-container"]} children={<ChatList />} />
      <section className={style["chat-content-container"]} children={<ChatContent />} />
      <section className={style["profile-container"]}></section>
    </main>
  );
};

const ChatContent: React.FC = ({}): JSX.Element => {
  const { client } = useClient();
  const { selected, update } = useChat();

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: 0 });
  }, [selected]);

  useEffect(() => {
    client.on(ChatSocketEvent.MESSAGE, update);
    client.on(ChatSocketEvent.MEMBER_BAN, update);
    client.on(ChatSocketEvent.MEMBER_JOIN, update);
    client.on(ChatSocketEvent.MEMBER_LEAVE, update);
    client.on(ChatSocketEvent.GROUP_CREATE, update);
    client.on(ChatSocketEvent.PRIVATE_CREATE, update);
    client.on(ChatSocketEvent.CHAT_EDIT, update);

    return () => {
      client.off(ChatSocketEvent.MESSAGE, update);
      client.off(ChatSocketEvent.MEMBER_BAN, update);
      client.off(ChatSocketEvent.MEMBER_JOIN, update);
      client.off(ChatSocketEvent.MEMBER_LEAVE, update);
      client.off(ChatSocketEvent.GROUP_CREATE, update);
      client.off(ChatSocketEvent.PRIVATE_CREATE, update);
      client.off(ChatSocketEvent.CHAT_EDIT, update);
    };
  }, []);

  return (
    <>
      <title children={selected || "Home"} />
      <div className={style["title"]} children={<ChatTitle />} />
      <Scrollbars className={style["content-container"]} autoHide>*
        <div className={style["messages-container"]} ref={ref} children={<Messages />} />
      </Scrollbars>

      <ChatInput />
    </>
  );
};

export default Chat;

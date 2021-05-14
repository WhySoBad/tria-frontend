import { Chat, ClientEvent, Group, Member, Message, PrivateChat } from "client";
import cn from "classnames";
import style from "../../styles/modules/Home.module.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import { useClient } from "../../hooks/ClientContext";
import Input from "../Input/Input";

const Home: FC = (): JSX.Element => {
  const { client } = useClient();
  const [selected, selectChat] = useState<string>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setMessage(null);
  }, [selected]);

  return (
    <main className={style["container"]}>
      <section className={style["chatlist-container"]}>
        {client.user.chats.entries().map(([uuid, chat]) => (
          <span key={uuid} onClick={() => selectChat(uuid)} children={<ChatSelect chat={chat} />} />
        ))}
      </section>
      <section className={style["chat-content-container"]}>
        {selected && <ChatComponent chat={client.user.chats.get(selected)} />}
        {!selected && <h1 children={"Home Screen Welcome Back"} />}
      </section>
      <section className={style["profile-container"]}></section>
    </main>
  );
};

interface ChatProps {
  chat: Chat;
}

const ChatSelect: FC<ChatProps> = ({ chat }): JSX.Element => {
  const { client } = useClient();

  const name: string = getChatName(chat);

  return (
    <div className={style["chat-select-container"]}>
      <h6 children={name} />
      <code children={chat.uuid} />
    </div>
  );
};

const ChatComponent: FC<ChatProps> = ({ chat }): JSX.Element => {
  const { client } = useClient();
  const [, setUpdate] = useState<number>();
  const messageRef = useRef<HTMLInputElement>(null);
  const name: string = getChatName(chat);

  useEffect(() => {
    if (!messageRef.current) return;
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [messageRef.current, chat]);

  client.on(ClientEvent.MESSAGE, () => setUpdate(new Date().getTime()));
  client.on(ClientEvent.MESSAGE_EDIT, () => setUpdate(new Date().getTime()));

  const messages: Array<Message> = chat.messages.values().sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const oldest: number = Math.min(...[...messages, { createdAt: new Date() }].map(({ createdAt }) => createdAt.getTime())) || new Date().getTime();

  return (
    <>
      <div className={style["header"]}>
        <h3 children={name} className={style["title"]} />
      </div>
      <div className={style["messages"]} ref={messageRef}>
        {messages.map((message: Message, index: number, arr: Array<Message>) => {
          const previous: Message = index < arr.length && arr[index + 1];
          const sameSender: boolean = previous?.sender === message.sender;
          const sameDate: boolean = previous?.createdAt?.toDateString() === message.createdAt.toDateString();
          return <MessageComponent message={message} withName={!sameSender} withDate={!sameDate} key={message.uuid} />;
        })}
        <MessageLoader
          timestamp={oldest}
          onLoad={(timestamp: number) => {
            if (!chat.lastFetched) {
              chat
                .fetchMessages(timestamp, 25)
                .then(() => {
                  console.log("Fetched messages");
                  setUpdate(new Date().getTime());
                })
                .catch((err) => client.error(err));
            }
          }}
        />
      </div>
      <div className={style["input-container"]}>
        <Input
          placeholder={"Enter message"}
          style={{ width: "1000px" }}
          onEnter={(event: React.KeyboardEvent<HTMLInputElement>) => {
            const text: string = event.currentTarget.value;
            if (!Boolean(text)) return;
            chat.sendMessage(text).catch((err) => client.error(err));
          }}
        />
      </div>
    </>
  );
};

interface MessageProps {
  withName?: boolean;
  withDate?: boolean;
  message: Message;
}

const MessageComponent: FC<MessageProps> = ({ message, withName = false, withDate = false }): JSX.Element => {
  const { client } = useClient();
  if (withDate) withName = true;
  const member: Member = client.user.chats.get(message.chat).members.get(message.sender);

  const time: string = message.createdAt.toLocaleTimeString().substr(0, 5);
  const ownMessage: boolean = client.user.uuid === message.sender;

  return (
    <>
      <div className={style["message-position"]}>
        <div className={cn(style["message-container"], ownMessage && style["self"])}>
          {withName && <h6 children={member.user.name} className={style["sender"]} />}
          <span children={message.text} className={style["message"]} />
          <code className={style["date"]} children={time} />
        </div>
      </div>
      {withDate && (
        <div className={style["message-position"]}>
          <span children={message.createdAt.toLocaleDateString()} className={style["message-date"]} />
        </div>
      )}
    </>
  );
};

interface MessageLoaderProps {
  timestamp: number;
  onLoad: (timestamp: number) => void;
}

const MessageLoader: React.FC<MessageLoaderProps> = ({ onLoad, timestamp }): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        onLoad(timestamp);
        observer.unobserve(ref.current);
      }
    });

    observer.observe(ref.current);
  }, []);

  return <div ref={ref} style={{ padding: "2rem" }} />;
};

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default Home;

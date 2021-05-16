import { Avatar, makeStyles } from "@material-ui/core";
import { Chat, ChatSocketEvent, getUserPreview, Member, Message, User, UserPreview } from "client";
import { MemberLog } from "client/dist/src/chat/classes/MemberLog.class";
import { SHA256 } from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";

const useStyles = makeStyles((theme) => ({}));

const Messages: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const classes = useStyles();

  const chat: Chat | undefined = client?.user.chats.get(selected);
  if (!chat) return <></>;

  const messages: Array<Message | MemberLog> = [...(chat?.messages.values() || []), ...(chat?.memberLog.values() || [])].sort((a, b) => {
    const dateA: Date = a instanceof Message ? a.createdAt : a.timestamp;
    const dateB: Date = b instanceof Message ? b.createdAt : b.timestamp;
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <>
      {chat && <MessageLoader />}

      {messages.map((message: Message | MemberLog, index: number, array: Array<Message | MemberLog>) => {
        const previous: false | Message | MemberLog = index !== 0 && array[index - 1];
        const previousDate: false | Date = previous && (previous instanceof Message ? previous.createdAt : previous.timestamp);
        const date: Date = message instanceof Message ? message.createdAt : message.timestamp;
        const sameDate: boolean = previousDate && previousDate.getDate() === date.getDate();
        const sameSender: boolean = previous instanceof Message && message instanceof Message && previous.sender === message.sender;
        return (
          <div key={message instanceof Message ? message.uuid : message.user}>
            {!sameDate && <DateContainer date={date} />}
            {message instanceof MemberLog && <MemberLogContainer message={message} />}
            {message instanceof Message && <div className={style["message-section"]} children={<MessageContainer message={message} withName={!sameSender || !sameDate} />} />}
          </div>
        );
      })}

      <BottomAnchor />
    </>
  );
};

interface MessageProps {
  message: Message;
  withName?: boolean;
  last?: boolean;
}

const MessageContainer: React.FC<MessageProps> = ({ message, withName = false, last = false }): JSX.Element => {
  const { client } = useClient();
  const { openMember } = useModal();
  const classes = useStyles();
  const chat: Chat | undefined = client.user.chats.get(message.chat);

  const sender: Member = chat.members.get(message.sender);
  const own: boolean = message.sender === client.user.uuid;

  const uuidHex: string = SHA256(sender.user.uuid).toString().substr(0, 6);

  return (
    <>
      {withName && <Avatar children={sender.user.name.substr(0, 1)} className={style["avatar"]} style={{ backgroundColor: `#${uuidHex}` }} onClick={() => openMember(sender)} />}
      <div className={style["message"]} style={{ boxShadow: `0 0 2px 0.5px #${uuidHex}` }}>
        {withName && <h6 className={style["sender"]} children={sender.user.name} onClick={() => openMember(sender)} />}
        <div className={style["text"]} children={message.text} />
        <code className={style["date"]} children={message.createdAt.toLocaleTimeString().substr(0, 5)} />
      </div>
      {last && <BottomAnchor />}
    </>
  );
};

interface MemberLogProps {
  message: MemberLog;
  last?: boolean;
}

const MemberLogContainer: React.FC<MemberLogProps> = ({ message, last = false }): JSX.Element => {
  const classes = useStyles();
  const { client } = useClient();
  const { openUser } = useModal();
  const [user, setUser] = useState<UserPreview>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    getUserPreview(message.user)
      .then(setUser)
      .catch(() => client.error("Failed fetching account"))
      .finally(() => setFetched(true));
  }, []);

  return (
    <>
      <code className={style["member-log"]} style={{ opacity: fetched ? 1 : 0 }}>
        {user ? <code children={user.name} className={style["name"]} onClick={() => openUser(new User(user as any))} /> : "Deleted Account"}
        {message.joined ? " joined" : " left"}
      </code>
      {last && <BottomAnchor />}
    </>
  );
};

interface DateProps {
  date: Date;
}

const DateContainer: React.FC<DateProps> = ({ date }): JSX.Element => {
  return <code className={style["date-log"]} children={date.toLocaleDateString()} />;
};

const MessageLoader: React.FC = (): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const { client } = useClient();
  const { update, selected } = useChat();
  const chat: Chat | undefined = client?.user.chats.get(selected);

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        const oldest: Message = chat.messages.values().sort((a, b) => a?.createdAt.getTime() - b?.createdAt.getTime())[0];
        if (oldest && !chat.lastFetched) {
          chat
            .fetchMessages(oldest.createdAt.getTime(), 25)
            .then(update)
            .catch((err) => console.error(err));
        }
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [selected]);

  return <div ref={ref} />;
};

const BottomAnchor: React.FC = (): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { client } = useClient();
  const { selected } = useChat();

  const handleMessage = (message: Message) => {
    if (message.sender === client.user.uuid || visible) ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  client.on(ChatSocketEvent.MESSAGE, handleMessage);

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      setVisible(entries[0].isIntersecting);
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      client.off(ChatSocketEvent.MESSAGE, handleMessage);
    };
  }, []);

  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, [selected]);

  return <div ref={ref} />;
};

export default Messages;

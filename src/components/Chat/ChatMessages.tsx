import { Avatar, CircularProgress } from "@material-ui/core";
import { BannedMember, Chat, ChatSocketEvent, ChatType, getUserPreview, Member, Message, UserPreview, Group } from "client";
import { MemberLog } from "client/dist/src/chat/classes/MemberLog.class";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";
import Scrollbar from "../Scrollbar/Scrollbar";
import Scrollbars from "react-custom-scrollbars-2";

const Messages: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const ref = useRef<Scrollbars>(null);
  const chat: Chat | undefined = client?.user.chats.get(selected);
  const [lastRead, setLastRead] = useState<Date>(chat?.lastRead);

  useEffect(() => {
    const hasMessages: boolean = chat && chat.messages.size !== 0;
    const lastMessage: Message | undefined = hasMessages ? chat.messages.values()[chat.messages.size - 1] : undefined;
    setLastRead(lastMessage && lastMessage.createdAt.getTime() !== chat.lastRead.getTime() ? chat.lastRead : null);
  }, [selected]);

  if (!chat) return <></>;

  const sorted: Array<Message | MemberLog> = [...(chat?.messages.values() || []), ...(chat?.memberLog.values() || [])].sort((a, b) => {
    const dateA: Date = a instanceof Message ? a.createdAt : a.timestamp;
    const dateB: Date = b instanceof Message ? b.createdAt : b.timestamp;
    return dateA.getTime() - dateB.getTime();
  });

  const dates: Array<number> = [];

  const groups: Array<Array<Message> | number> = [];

  sorted.forEach((message: Message | MemberLog, index: number, arr: Array<Message | MemberLog>) => {
    if (message instanceof MemberLog) return;
    const previous: Message | MemberLog | undefined = index > 0 ? arr[index - 1] : undefined;
    const previousDate: Date | undefined = previous ? (previous instanceof MemberLog ? previous.timestamp : previous.createdAt) : undefined;
    const date: Date = message instanceof MemberLog ? message.timestamp : message.createdAt;
    if (lastRead && previousDate && previousDate.getTime() < lastRead?.getTime() && date.getTime() >= lastRead?.getTime()) dates.push(lastRead?.getTime());
    if (previous instanceof MemberLog) dates.push(previous.timestamp.getTime());
    else if (!previous || previous.sender !== message.sender) dates.push(message.createdAt.getTime());
    else if (previous.createdAt.toLocaleDateString() !== message.createdAt.toLocaleDateString()) dates.push(message.createdAt.getTime());
  });

  dates.forEach((timestamp: number, index: number, arr: Array<number>) => {
    const next: number | undefined = index === arr.length - 1 ? undefined : arr[index + 1];
    const messages: Array<Message> = sorted.filter((value) => value instanceof Message) as any;
    const group: Array<Message> = messages.filter((value: Message) => {
      const { createdAt } = value;
      return createdAt.getTime() >= timestamp && (!next || createdAt.getTime() < next);
    }) as any;
    if (group.length === 0 && timestamp === lastRead?.getTime()) groups.push(lastRead?.getTime());
    else groups.push(group);
  });

  const messages: Array<Array<Message> | MemberLog | number> = [...groups, ...(chat?.memberLog.values() || [])].sort((a, b) => {
    const dateA: number = typeof a !== "number" ? (Array.isArray(a) ? a[0].createdAt : a.timestamp).getTime() : a;
    const dateB: number = typeof b !== "number" ? (Array.isArray(b) ? b[0].createdAt : b.timestamp).getTime() : b;
    return dateA - dateB;
  });

  return (
    <Scrollbar reference={ref}>
      {chat && <MessageLoader reference={ref} />}
      {messages.map((value: Array<Message> | MemberLog | number, index: number, arr: Array<Array<Message> | MemberLog>) => {
        const key: string = typeof value !== "number" ? (value instanceof MemberLog ? value.user : `${value[0]?.uuid}-${value[value.length - 1].uuid}`) : value.toString();
        const previous: Array<Message> | MemberLog | undefined = index > 0 ? arr[index - 1] : undefined;
        const previousDate: Date | undefined = Array.isArray(previous) ? previous[0]?.createdAt : previous ? previous.timestamp : undefined;
        const date: Date | undefined = Array.isArray(value) ? value[0]?.createdAt : typeof value !== "number" ? value.timestamp : undefined;
        const unread: boolean = date && date.getTime() > chat.lastRead.getTime();

        return (
          <React.Fragment key={index + key}>
            {index === 0 && chat.lastFetched && <code className={style["log-container"]} children={"Start of the chat"} />}
            {((date && previousDate && date.toLocaleDateString() !== previousDate.toLocaleDateString()) || index === 0) && <Date date={date} key={date.getTime()} />}
            {value === lastRead?.getTime() && typeof value === "number" && lastRead && <code className={style["log-container"]} children={"New messages"} />}
            {value instanceof MemberLog && chat.type !== ChatType.PRIVATE && <Log log={value} key={key} />}
            {Array.isArray(value) && <MessageGroup unread={unread} messages={value} key={key} />}
          </React.Fragment>
        );
      })}
      <BottomAnchor />
    </Scrollbar>
  );
};

interface MessageGroupProps {
  messages: Array<Message>;
  unread?: boolean;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ messages, unread = false }): JSX.Element => {
  const { client } = useClient();
  const { openMember } = useModal();
  const { update } = useChat();
  if (messages.length === 0) return <></>;
  const groupRef = useRef<HTMLDivElement>(null);
  const message: Message = messages[0];
  const chat: Chat | undefined = client.user.chats.get(message.chat);
  const sender: Member | undefined | BannedMember = chat.members.get(message.sender) || (chat instanceof Group && chat.bannedMembers.get(message.sender));
  const isSelf: boolean = (sender instanceof Member ? sender.user.uuid : sender ? sender.uuid : "") === client.user.uuid;

  const getDate = (message: Message): string => {
    const hours: number = message.createdAt.getHours() % 12 === 0 ? 12 : message.createdAt.getHours() % 12;
    const minutes: number = message.createdAt.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} ${message.createdAt.getHours() > 12 ? "PM" : "AM"}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && unread) {
        chat
          .readUntil(messages[messages.length - 1].createdAt)
          .then(update)
          .catch(client.error);
      }
    });
    observer.observe(groupRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className={style["group-container"]} ref={groupRef}>
      <div className={style["avatar-container"]} data-banned={!(sender instanceof Member)} data-self={isSelf}>
        <Avatar
          src={sender && (sender instanceof Member ? sender.user.avatarURL : sender.avatarURL)}
          className={style["avatar"]}
          style={{ backgroundColor: sender && (sender instanceof Member ? sender.user.color : sender.color) }}
          onClick={() => sender instanceof Member && openMember(sender)}
        />
      </div>
      <div className={style["content-container"]}>
        {messages.map((message: Message, index: number) => {
          return (
            <div key={message.uuid} id={message.uuid} className={style["message-container"]} data-self={isSelf}>
              <div className={style["message"]}>
                {index === 0 && (
                  <h6
                    data-banned={!(sender instanceof Member)}
                    children={sender ? (sender instanceof Member ? sender.user.name : sender.name) : "Unknown Account"}
                    className={style["name"]}
                    onClick={() => sender instanceof Member && openMember(sender)}
                  />
                )}
                <div className={style["text"]}>
                  <span children={message.text} />
                  <span className={style["date"]}>
                    {getDate(message)}
                    <span className={style["inner"]} children={getDate(message)} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

interface DateProps {
  date: Date;
}

const Date: React.FC<DateProps> = ({ date }): JSX.Element => {
  return (
    <div className={style["date-container"]}>
      <code children={date.toLocaleDateString()} />
    </div>
  );
};

interface LogProps {
  log: MemberLog;
  last?: boolean;
}

const Log: React.FC<LogProps> = ({ log, last = false }): JSX.Element => {
  const { client } = useClient();
  const { openUser } = useModal();
  const [user, setUser] = useState<UserPreview>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const member: Member = client.user.chats
      .values()
      .flatMap(({ members }) => members.values())
      .find(({ user: { uuid } }) => uuid === log.user);

    if (member) {
      setUser(member.user);
      setFetched(true);
    } else {
      getUserPreview(log.user)
        .then((user: UserPreview) => mounted && setUser(user))
        .catch(() => client.error("Failed fetching account"))
        .finally(() => mounted && setFetched(true));
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <code className={style["log-container"]} style={{ opacity: fetched ? 1 : 0 }}>
        {user ? <code children={user.name} className={style["log"]} onClick={() => openUser(user)} /> : "Deleted Account"}
        {log.joined ? " joined" : " left"}
      </code>
      {last && <BottomAnchor />}
    </>
  );
};

interface MessageLoaderProps {
  reference: MutableRefObject<Scrollbars>;
}

const MessageLoader: React.FC<MessageLoaderProps> = ({ reference }): JSX.Element => {
  const loaderRef = useRef<HTMLInputElement>(null);
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
            .then(() => {
              const start: number = reference.current.getScrollHeight();
              update();
              reference.current.scrollTop(reference.current.getScrollHeight() - start);
            })
            .catch((err) => console.error(err));
        }
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [selected]);

  return (
    <div className={style["loader-container"]} ref={loaderRef}>
      {!chat.lastFetched && <CircularProgress classes={{ root: style["loader"] }} />}
    </div>
  );
};

const BottomAnchor: React.FC = (): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { client } = useClient();
  const { selected } = useChat();
  const chat: Chat | undefined = client.user.chats.get(selected);

  const handleMessage = (chatUuid: string, message: Message) => {
    if (chatUuid !== chat.uuid) return;
    if (message.sender === client.user.uuid || visible) ref?.current?.scrollIntoView({ behavior: "smooth" });
    if (visible && chat && message.sender !== client.user.uuid) chat.readUntil(message.createdAt);
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

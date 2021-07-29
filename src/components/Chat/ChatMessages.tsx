import { Avatar, CircularProgress } from "@material-ui/core";
import { BannedMember, Chat, ChatSocketEvent, ChatType, getUserPreview, Member, Message, UserPreview, Group, MemberLog } from "client";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";
import Scrollbar from "../Scrollbar/Scrollbar";
import Scrollbars from "react-custom-scrollbars-2";
import { debouncedPromise } from "../../util";
import Menu, { MenuItem } from "../Menu/Menu";

const Messages: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const ref = useRef<Scrollbars>(null);
  const chat: Chat | undefined = client?.user.chats.get(selected);
  const [lastRead, setLastRead] = useState<Date>(chat?.lastRead);
  const [reading, setReading] = useState<boolean>(false);
  const [, setUpdate] = useState<number>();

  const handleUpdate = (chatUuid: string) => chatUuid === selected && setUpdate(new Date().getTime());

  useEffect(() => {
    client.on(ChatSocketEvent.MESSAGE, handleUpdate);
    client.on(ChatSocketEvent.MESSAGE_EDIT, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_JOIN, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_LEAVE, handleUpdate);
    return () => {
      client.off(ChatSocketEvent.MESSAGE, handleUpdate);
      client.off(ChatSocketEvent.MESSAGE_EDIT, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_JOIN, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_LEAVE, handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!chat) return;
    const messages: Array<Message> = chat.messages.values().filter(({ createdAt, sender }) => {
      return sender !== client.user.uuid && createdAt.getTime() > chat.lastRead.getTime();
    });
    setLastRead(messages.length > 0 ? chat.lastRead : null);
  }, [selected]);

  const handleRead = debouncedPromise(async (timestamp: number, cb: () => void) => {
    if (timestamp > chat.lastRead.getTime() && !reading) {
      setReading(true);
      await chat.readUntil(timestamp).catch(client.error);
      cb();
      setReading(false);
    }
  }, 250);

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
    if (lastRead && previousDate && previousDate.getTime() <= lastRead?.getTime() && date.getTime() > lastRead?.getTime()) dates.push(lastRead?.getTime());
    else if (previous instanceof MemberLog) dates.push(previous.timestamp.getTime());
    else if (!previous || previous.sender !== message.sender) dates.push(message.createdAt.getTime());
    else if (previous.createdAt.toLocaleDateString() !== message.createdAt.toLocaleDateString()) dates.push(message.createdAt.getTime());
  });

  dates.forEach((timestamp: number, index: number, arr: Array<number>) => {
    if (timestamp === lastRead?.getTime()) {
      const existsTwice: boolean = arr.filter((value) => value === timestamp).length === 2;
      if (existsTwice) {
        const firstIndex: number = arr.indexOf(timestamp);
        if (index === firstIndex) groups.push(timestamp);
      } else groups.push(timestamp);
    }
    const next: number | undefined = index === arr.length - 1 ? undefined : arr[index + 1];
    const beforeLastRead: boolean = lastRead && next === lastRead.getTime();
    const messages: Array<Message> = sorted.filter((value) => value instanceof Message) as any;
    const group: Array<Message> = messages.filter((value: Message) => {
      const { createdAt } = value;
      if (beforeLastRead && createdAt.getTime() === next) return true;
      if (timestamp === lastRead?.getTime() && createdAt.getTime() === timestamp) return false;
      return createdAt.getTime() >= timestamp && (!next || createdAt.getTime() < next);
    }) as any;
    groups.push(group);
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
        return (
          <React.Fragment key={index + key}>
            {index === 0 && chat.lastFetched && <code className={style["log-container"]} children={"Start of the chat"} />}
            {((date && previousDate && date.toLocaleDateString() !== previousDate.toLocaleDateString()) || index === 0) && <DateEl date={date} key={date.getTime()} />}
            {typeof value === "number" && lastRead && <code className={style["log-container"]} children={"New messages"} />}
            {value instanceof MemberLog && chat.type !== ChatType.PRIVATE && <Log log={value} key={key} />}
            {Array.isArray(value) && <MessageGroup onRead={handleRead} messages={value} key={key} />}
          </React.Fragment>
        );
      })}
      <BottomAnchor />
    </Scrollbar>
  );
};

interface MessageGroupProps {
  messages: Array<Message>;
  onRead: (timestamp: number, cb: () => void) => void;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ messages, onRead }): JSX.Element => {
  const { client } = useClient();
  const { openMember } = useModal();
  if (messages.length === 0) return <></>;
  const message: Message = messages[0];
  const chat: Chat | undefined = client.user.chats.get(message.chat);
  const sender: Member | undefined | BannedMember = chat.members.get(message.sender) || (chat instanceof Group && chat.bannedMembers.get(message.sender));
  const isSelf: boolean = (sender instanceof Member ? sender.user.uuid : sender ? sender.uuid : "") === client.user.uuid;

  const getDate = (message: Message): string => {
    const hours: number = message.createdAt.getHours() % 12 === 0 ? 12 : message.createdAt.getHours() % 12;
    const minutes: number = message.createdAt.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} ${message.createdAt.getHours() > 12 ? "PM" : "AM"}`;
  };

  const src: string | boolean = sender && (sender instanceof Member ? sender.user.avatarURL : sender.avatarURL);

  return (
    <section className={style["group-container"]}>
      <div className={style["avatar-container"]} data-banned={!(sender instanceof Member)} data-self={isSelf}>
        <Avatar
          src={src}
          className={style["avatar"]}
          style={{ backgroundColor: !src && sender && (sender instanceof Member ? sender.user.color : sender.color) }}
          onClick={() => sender instanceof Member && openMember(sender)}
        />
      </div>
      <div className={style["content-container"]}>
        {messages.map((message: Message, index: number) => {
          return <MessageEl onRead={onRead} key={message.uuid} message={message} date={getDate(message)} first={index === 0} self={isSelf} sender={sender} read={message.createdAt <= chat.lastRead} />;
        })}
      </div>
    </section>
  );
};

interface MessageProps {
  message: Message;
  sender: Member | BannedMember | undefined;
  self: boolean;
  read: boolean;
  first: boolean;
  date: string;
  onRead: (timestamp: number, cb: () => void) => void;
}

const MessageEl: React.FC<MessageProps> = ({ message, self, read, first, onRead, date, sender }): JSX.Element => {
  const { openMember } = useModal();
  const { client } = useClient();
  const [isRead, setRead] = useState<boolean>(read);
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [menuPos, setMenuPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isRead) onRead(message.createdAt.getTime(), () => setRead(true));
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (textRef.current && editing) textRef.current.focus();
  }, [editing]);

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuPos({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => setMenuPos({ x: null, y: null });

  return (
    <div ref={ref} id={message.uuid} className={style["message-container"]} data-self={self} onContextMenu={handleRightClick}>
      <div className={style["message"]} data-editing={editing}>
        {first && (
          <h6
            data-banned={!(sender instanceof Member)}
            children={sender ? (sender instanceof Member ? sender.user.name : sender.name) : "Unknown Account"}
            className={style["name"]}
            onClick={() => sender instanceof Member && openMember(sender)}
          />
        )}
        <div className={style["text"]}>
          <span
            ref={textRef}
            children={message.text}
            onKeyPress={(event) => {
              if (event.key === "\n") document.execCommand("insertText", false, "\n");
              else if (event.key === "Enter") {
                event.preventDefault();
                if (textRef.current.innerText !== message.text) {
                  message
                    .setText(textRef.current.innerText)
                    .then(() => setEditing(false))
                    .catch(client.error);
                } else setEditing(false);
              }
            }}
            contentEditable={editing}
            spellCheck={false}
            defaultValue={message.text}
            suppressContentEditableWarning
          />
          <span className={style["date"]} data-edited={message.edited > 0}>
            <span children={date} />
            {message.edited > 0 && <span children={`${message.edited}x Edited`} />}
            <span className={style["inner"]}>
              <span children={date} />
              {message.edited > 0 && <span children={`${message.edited}x Edited`} />}
            </span>
          </span>
        </div>
      </div>
      <Menu keepMounted open={menuPos.x !== null} onClose={handleMenuClose} anchorReference={"anchorPosition"} anchorPosition={menuPos.x === null ? undefined : { left: menuPos.x, top: menuPos.y }}>
        <MenuItem children={"Profile"} onClick={() => sender instanceof Member && openMember(sender)} autoClose onClose={handleMenuClose} />
        {message.sender === client.user.uuid && !editing && <MenuItem children={"Edit Message"} onClick={() => setEditing(true)} autoClose onClose={handleMenuClose} />}
        {editing && (
          <MenuItem
            children={"Stop Editing"}
            onClick={() => {
              textRef.current.innerText = message.text;
              setEditing(false);
            }}
            autoClose
            onClose={handleMenuClose}
          />
        )}
      </Menu>
    </div>
  );
};

interface DateProps {
  date: Date;
}

const DateEl: React.FC<DateProps> = ({ date }): JSX.Element => {
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
        .catch(client.error)
        .finally(() => mounted && setFetched(true));
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className={style["log-container"]} style={{ opacity: fetched ? 1 : 0 }}>
        {user ? <span children={user.name} className={style["log"]} onClick={() => openUser(user)} /> : "Deleted Account"}
        {log.joined ? " joined" : " left"}
      </div>
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
            .catch(client.error);
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
    /*   if (visible && chat && message.sender !== client.user.uuid) chat.readUntil(message.createdAt); */
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

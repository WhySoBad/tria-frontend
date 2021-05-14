import { Avatar, makeStyles } from "@material-ui/core";
import { Chat, ChatSocketEvent, getUserPreview, Member, Message, UserPreview } from "client";
import { MemberLog } from "client/dist/src/chat/classes/MemberLog.class";
import { SHA256 } from "crypto-js";
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from "node:constants";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import UserModal from "../Modal/UserModal";

const useStyles = makeStyles((theme) => ({
  messageSection: {
    display: "grid",
    gridTemplateAreas: '"own message member"',
    gridTemplateColumns: "3.5rem auto 3.5rem",

    padding: "0 0.5rem",
    marginRight: "0.25rem",
  },
  message: {
    gridArea: "message",
    justifySelf: "start",
    display: "grid",
    gridTemplateAreas: '"sender . ." "message message date" ',
    padding: "0.25rem 0.75rem",
    backgroundColor: "#2c3039",
    borderRadius: "5px",
    margin: "0.2rem 0",
    width: "100%",
  },
  sender: {
    gridArea: "sender",
    marginBottom: "0.25rem",
    width: "fit-content",

    "&:hover": {
      cursor: "pointer",
    },
  },
  avatar: {
    gridArea: "own",
    marginTop: "0.5rem",
    transition: "all 0.2s",
    "&:hover": {
      cursor: "pointer",
    },
    "&:active": {
      transform: "translateY(-2px)",
    },
  },

  text: {
    gridArea: "message",
  },
  sendDate: {
    gridArea: "date",
    fontSize: "14px",
    textAlign: "right",
  },
  memberLog: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    padding: "0.25rem 0.75rem",
    margin: "1rem 0",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  memberName: {
    marginRight: "1ch",
    "&:hover": {
      cursor: "pointer",
    },
  },
  date: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    padding: "0.25rem 0.75rem",
    margin: "1rem 0",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
}));

const Messages: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected, update } = useChat();
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
            {message instanceof Message && <div className={classes.messageSection} children={<MessageContainer message={message} withName={!sameSender || !sameDate} />} />}
          </div>
        );
      })}

      <BottomAnchor scrollTo={true} />
    </>
  );
};

interface MessageProps {
  message: Message;
  withName?: boolean;
}

const MessageContainer: React.FC<MessageProps> = ({ message, withName = false }): JSX.Element => {
  const { client } = useClient();
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const chat: Chat | undefined = client.user.chats.get(message.chat);

  const sender: Member = chat.members.get(message.sender);
  const own: boolean = message.sender === client.user.uuid;

  const uuidHash: string = SHA256(sender.user.uuid).toString();

  return (
    <>
      {withName && <Avatar children={sender.user.name.substr(0, 1)} className={classes.avatar} style={{ backgroundColor: `#${uuidHash.substr(0, 6)}` }} onClick={() => setOpen(true)} />}
      <div className={classes.message} style={{ boxShadow: `0 0 2px 0.5px #${uuidHash.substr(0, 6)}` }}>
        {withName && <h6 className={classes.sender} children={sender.user.name} onClick={() => setOpen(true)} />}
        <div className={classes.text} children={message.text} />
        <code className={classes.sendDate} children={message.createdAt.toLocaleTimeString().substr(0, 5)} />
      </div>
      <UserModal user={sender.user} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

interface MemberLogProps {
  message: MemberLog;
}

const MemberLogContainer: React.FC<MemberLogProps> = ({ message }): JSX.Element => {
  const classes = useStyles();
  const { client } = useClient();
  const [user, setUser] = useState<UserPreview>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getUserPreview(message.user)
      .then(setUser)
      .catch(() => client.error("Failed Fetching Account"));
  }, []);

  return (
    <>
      <code className={classes.memberLog}>
        {user ? <code children={user.name} className={classes.memberName} onClick={() => setOpen(true)} /> : "Deleted Account"}
        {message.joined ? " joined" : " left"}
      </code>
      <UserModal user={user || ({} as any)} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

interface DateProps {
  date: Date;
}

const DateContainer: React.FC<DateProps> = ({ date }): JSX.Element => {
  const classes = useStyles();
  return <code className={classes.date} children={date.toLocaleDateString()} />;
};

const MessageLoader: React.FC = ({}): JSX.Element => {
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
  }, []);

  return <div ref={ref} />;
};

interface BottomAnchorProps {
  scrollTo?: boolean;
}

const BottomAnchor: React.FC<BottomAnchorProps> = ({ scrollTo = false }): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { client } = useClient();
  const { selected } = useChat();

  const handleMessage = (message: Message) => {
    if (message.sender === client.user.uuid || visible) ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      setVisible(entries[0].isIntersecting);
    });

    observer.observe(ref.current);
    client.on(ChatSocketEvent.MESSAGE, handleMessage);

    return () => {
      observer.disconnect();
      client.off(ChatSocketEvent.MESSAGE, handleMessage);
    };
  }, []);

  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, [selected]);

  useEffect(() => {
    if (scrollTo) ref?.current?.scrollIntoView();
  }, [scrollTo]);

  return <div ref={ref} />;
};

export default Messages;

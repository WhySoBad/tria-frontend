import { Avatar, ButtonBase, makeStyles } from "@material-ui/core";
import { Chat, Group, Member, Message, PrivateChat } from "client";
import React from "react";
import style from "../../styles/modules/Chat.module.scss";
import cn from "classnames";
import { useClient } from "../../hooks/ClientContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Scrollbar from "../Scrollbar/Scrollbar";
import { Home as HomeIcon, Explore as ExploreIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({}));

const ChatList: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const router = useRouter();

  return (
    <Scrollbar>
      <Section>
        <Item href={"/app"} icon={<HomeIcon />} text={"Home"} selected={router.pathname === "/app"} />
      </Section>
      <Section title={"Chats"}>
        {client?.user.chats
          .values()
          .sort((a, b) => {
            const lastA: Message = a.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            const lastB: Message = b.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            return lastB?.createdAt.getTime() - lastA?.createdAt.getTime();
          })
          .map((chat: Chat) => {
            return <ChatItem chat={chat} key={chat.uuid} />;
          })}
      </Section>
      <Section>
        <Item href={"/app"} icon={<ExploreIcon />} text={"Find chats"} />
        <Item href={"/app"} icon={<ExploreIcon />} text={"Find user"} />
      </Section>
    </Scrollbar>
  );
};

interface ChatContainerProps {
  uuid: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ uuid }): JSX.Element => {
  const { client } = useClient();

  const router = useRouter();
  const selected: string = router.query.uuid as string;

  const classes = useStyles();

  const chat: Chat | undefined = client.user.chats.get(uuid);
  const name: string = getChatName(chat);
  const avatarSrc: string = chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const lastMessage: Message | undefined = chat.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const lastSender: Member | undefined = chat.members.get(lastMessage?.sender);

  return (
    <Link href={`/chat/${uuid}`}>
      <ButtonBase disableRipple className={cn(style["item"], selected === uuid && style["selected"])}>
        <Avatar className={style["avatar"]} src={avatarSrc} style={{ backgroundColor: chat.color }} alt={name} />
        <h6 children={name} className={style["title"]} />
        <div className={style["description"]}>
          {lastSender && <code children={lastSender.user.name + ":"} className={style["sender"]} />}
          <code children={lastMessage?.text || "Chat created"} className={style["text"]} />
        </div>
      </ButtonBase>
    </Link>
  );
};

interface SectionProps {
  title?: string;
}

const Section: React.FC<SectionProps> = ({ title, children }): JSX.Element => {
  return (
    <section className={style["section"]}>
      {title && <h3 children={title} className={style["title"]} />}
      {children}
    </section>
  );
};

interface ItemProps {
  icon: JSX.Element;
  text: string;
  href: string;
  selected?: boolean;
}

const Item: React.FC<ItemProps> = ({ href, icon, text, selected = false }): JSX.Element => {
  return (
    <Link href={href}>
      <div className={style["burger-item"]} aria-selected={selected}>
        <div className={style["burger-icon"]} children={icon} />
        <div className={style["burger-text"]} children={text} />
      </div>
    </Link>
  );
};

interface ChatItemProps {
  chat: Chat;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }): JSX.Element => {
  const href: string = `/chat/${chat.uuid}`;
  const name: string = getChatName(chat);
  const src: string = chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";

  const router = useRouter();
  const selected: string = router.query.uuid as string;

  return (
    <Link href={href}>
      <div className={style["burger-item"]} aria-selected={chat.uuid === selected}>
        <div className={style["burger-icon"]} children={<Avatar className={style["avatar"]} src={src} style={{ backgroundColor: chat.color, width: "2rem", height: "2rem" }} alt={name} />} />
        <h6 className={style["burger-text"]} children={name} />
      </div>
    </Link>
  );
};

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default ChatList;

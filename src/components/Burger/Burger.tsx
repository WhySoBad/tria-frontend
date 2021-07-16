import { Chat, ChatSocketEvent, Group, PrivateChat } from "client";
import { useRouter } from "next/router";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Burger.module.scss";
import Scrollbar from "../Scrollbar/Scrollbar";
import { Search as ExploreIcon, AddBox as AddIcon, Person as ProfileIcon, ExitToApp as LogoutIcon, Group as GroupIcon, Menu as MenuIcon } from "@material-ui/icons";
import Link from "next/link";
import { Avatar, Badge } from "@material-ui/core";
import { useModal } from "../../hooks/ModalContext";
import { UserSocketEvent } from "../../../../client/dist/src/websocket/types/UserSocket.types";

interface BurgerProps {
  open: boolean;
  onClick?: () => void;
  onCollapse?: () => void;
}

const Burger: React.FC<BurgerProps> = ({ onClick, open, onCollapse }): JSX.Element => {
  const { client } = useClient();
  const { openChatCreate } = useModal();
  const [, setUpdate] = useState<number>();

  const handleUpdate = () => setUpdate(new Date().getTime());

  useEffect(() => {
    client.on(ChatSocketEvent.MEMBER_ONLINE, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_OFFLINE, handleUpdate);
    client.on(ChatSocketEvent.GROUP_CREATE, handleUpdate);
    client.on(ChatSocketEvent.PRIVATE_CREATE, handleUpdate);
    client.on(ChatSocketEvent.CHAT_DELETE, handleUpdate);
    client.on(ChatSocketEvent.MESSAGE, handleUpdate);
    client.on(ChatSocketEvent.CHAT_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_DELETE, handleUpdate);
    return () => {
      client.off(ChatSocketEvent.MEMBER_ONLINE, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_OFFLINE, handleUpdate);
      client.off(ChatSocketEvent.GROUP_CREATE, handleUpdate);
      client.off(ChatSocketEvent.PRIVATE_CREATE, handleUpdate);
      client.off(ChatSocketEvent.CHAT_DELETE, handleUpdate);
      client.off(ChatSocketEvent.MESSAGE, handleUpdate);
      client.off(ChatSocketEvent.CHAT_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_DELETE, handleUpdate);
    };
  }, []);

  const sortedChats: Array<Chat> = [
    ...(client?.user?.chats?.values() || []).sort((a, b) => {
      const lastA: Date = a.messages.values().sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())[0]?.createdAt || a.createdAt;
      const lastB: Date = b.messages.values().sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())[0]?.createdAt || b.createdAt;
      return lastB.getTime() - lastA.getTime();
    }),
  ];

  return (
    <Scrollbar withPadding={false} withMargin={false}>
      <Section>
        <Item open={open} icon={<MenuIcon />} text={""} onClick={onCollapse} />
        <Item open={open} href={"/profile"} icon={<ProfileIcon />} text={"Profile"} onClick={onClick} />
      </Section>
      {sortedChats.length !== 0 && (
        <Section>
          {sortedChats.map((chat: Chat) => {
            return <ChatItem open={open} chat={chat} key={chat.uuid} onClick={onClick} />;
          })}
        </Section>
      )}
      <Section>
        <Item open={open} href={"/explore"} icon={<ExploreIcon />} text={"Explore"} onClick={onClick} />
        <Item open={open} icon={<AddIcon />} text={"Create"} onClick={openChatCreate} />
        <Item open={open} href={"/"} icon={<LogoutIcon />} text={"Logout"} onClick={onClick} />
      </Section>
    </Scrollbar>
  );
};

interface SectionProps {
  title?: string;
  onClick?: () => void;
}

const Section: React.FC<SectionProps> = ({ onClick, title, children }): JSX.Element => {
  return (
    <section className={style["section"]}>
      {title && <h3 children={title} className={style["title"]} />}
      <div onClick={onClick}> {children} </div>
    </section>
  );
};

interface ItemProps {
  icon: JSX.Element;
  text: string;
  href?: string;
  open: boolean;
  onClick?: () => void;
}

const Item: React.FC<ItemProps> = ({ href, icon, text, onClick, open }): JSX.Element => {
  const router = useRouter();
  const selected: boolean = href?.toLowerCase() === router.pathname.toLowerCase();

  const content: JSX.Element = (
    <div onClick={onClick} className={style["burger-item"]} aria-selected={selected}>
      <div className={style["burger-icon"]} children={icon} />
      <div className={style["burger-text"]} children={text} data-open={open} />
    </div>
  );

  if (!Boolean(href)) return content;
  else return <Link href={href} children={content} />;
};

interface ChatItemProps {
  chat: Chat;
  open: boolean;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, open, onClick }): JSX.Element => {
  const { client } = useClient();
  const href: string = `/chat/${chat.uuid}`;
  const name: string = getChatName(chat);
  const src: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";

  const router = useRouter();
  const selected: string = router.query.uuid as string;
  const unread: number = chat.messages.values().filter(({ createdAt, sender }) => sender !== client.user.uuid && createdAt.getTime() > chat.lastRead.getTime()).length;

  return (
    <Link href={href}>
      <div onClick={onClick} className={style["burger-item"]} aria-selected={chat.uuid === selected} data-unread={unread !== 0}>
        <div className={style["burger-icon"]}>
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            classes={{ badge: cn(style["badge"], !open && style["closed"]) }}
            variant="dot"
            badgeContent=""
            data-online={chat instanceof PrivateChat && chat.participant.user.online}
            data-group={chat instanceof Group}
          >
            <Avatar className={style["avatar"]} src={src} style={{ backgroundColor: !src && chat.color, width: "2rem", height: "2rem" }} />
          </Badge>
        </div>
        <div className={style["burger-text-container"]} data-open={open}>
          <h6 className={style["burger-text"]} children={name} />
          {chat instanceof Group && <GroupIcon className={style["icon"]} />}
        </div>
        {unread !== 0 && (
          <Badge badgeContent={unread} variant={"standard"} style={{ display: "flex", alignItems: "center" }} classes={{ badge: cn(style["burger-unread"], !open && style["closed"]) }} />
        )}
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

export default Burger;

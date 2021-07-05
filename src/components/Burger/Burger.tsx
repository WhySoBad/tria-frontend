import { Chat, Group, PrivateChat } from "client";
import { useRouter } from "next/router";
import cn from "classnames";
import React from "react";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Burger.module.scss";
import Scrollbar from "../Scrollbar/Scrollbar";
import { Home as HomeIcon, Search as ExploreIcon, AddBox as AddIcon, Person as ProfileIcon, ExitToApp as LogoutIcon, Group as GroupIcon } from "@material-ui/icons";
import Link from "next/link";
import { Avatar, Badge } from "@material-ui/core";
import { useModal } from "../../hooks/ModalContext";

interface BurgerProps {
  onClick?: () => void;
}

const Burger: React.FC<BurgerProps> = ({ onClick }): JSX.Element => {
  const { client } = useClient();
  const { openChatCreate } = useModal();

  if (!client) return <></>;

  const sortedChats: Array<Chat> = [
    ...client?.user?.chats?.values().sort((a, b) => {
      const lastA: Date = a.messages.values().sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())[0]?.createdAt || a.createdAt;
      const lastB: Date = b.messages.values().sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())[0]?.createdAt || b.createdAt;
      return lastB.getTime() - lastA.getTime();
    }),
  ];

  return (
    <Scrollbar>
      <Section onClick={onClick}>
        <Item href={"/app"} icon={<HomeIcon />} text={"Home"} />
        <Item href={"/profile"} icon={<ProfileIcon />} text={"Profile"} />
      </Section>
      <Section onClick={onClick}>
        {sortedChats.map((chat: Chat) => {
          return <ChatItem chat={chat} key={chat.uuid} />;
        })}
      </Section>
      <Section onClick={onClick}>
        <Item href={"/explore"} icon={<ExploreIcon />} text={"Explore"} />
        <Item icon={<AddIcon />} text={"Create"} onClick={openChatCreate} />
        <Item href={"/"} icon={<LogoutIcon />} text={"Logout"} />
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
  onClick?: () => void;
}

const Item: React.FC<ItemProps> = ({ href, icon, text, onClick }): JSX.Element => {
  const router = useRouter();
  const selected: boolean = href?.toLowerCase() === router.pathname.toLowerCase();

  const content: JSX.Element = (
    <div onClick={onClick} className={cn(style["burger-item"], selected && style["selected"])} aria-selected={selected}>
      <div className={style["burger-icon"]} children={icon} />
      <div className={style["burger-text"]} children={text} />
    </div>
  );

  if (!Boolean(href)) return content;
  else return <Link href={href} children={content} />;
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
      <div className={cn(style["burger-item"], selected && style["selected"])} aria-selected={chat.uuid === selected}>
        <div className={style["burger-icon"]}>
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            classes={{ badge: style["badge"] }}
            variant="dot"
            badgeContent=""
            data-online={chat instanceof PrivateChat && chat.participant.user.online}
            data-group={chat instanceof Group}
          >
            <Avatar className={style["avatar"]} src={src} style={{ backgroundColor: chat.color, width: "2rem", height: "2rem" }} alt={name} />
          </Badge>
        </div>
        <div className={style["burger-text-container"]}>
          <h6 className={style["burger-text"]} children={name} />
          {chat instanceof Group && <GroupIcon className={style["icon"]} />}
        </div>
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

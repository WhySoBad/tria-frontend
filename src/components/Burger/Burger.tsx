import { Admin, Chat, ChatSocketEvent, Group, Owner, PrivateChat } from "client";
import { useRouter } from "next/router";
import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Burger.module.scss";
import Scrollbar from "../Scrollbar/Scrollbar";
import { Search as ExploreIcon, AddBox as AddIcon, Person as ProfileIcon, ExitToApp as LogoutIcon, Group as GroupIcon, Menu as MenuIcon, Mouse, MouseSharp } from "@material-ui/icons";
import Link from "next/link";
import { Avatar, Badge } from "@material-ui/core";
import { useModal } from "../../hooks/ModalContext";
import { UserSocketEvent } from "../../../../client/dist/src/websocket/types/UserSocket.types";
import Menu, { MenuItem } from "../Menu/Menu";

interface BurgerProps {
  open: boolean;
  onClick?: () => void;
  onCollapse?: () => void;
}

const Burger: React.FC<BurgerProps> = ({ onClick, open, onCollapse }): JSX.Element => {
  const { client } = useClient();
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
    <Scrollbar>
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
        <Item open={open} href={"/create"} icon={<AddIcon />} text={"Create"} onClick={onClick} />
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
      <h6 className={style["burger-text"]} children={text} data-open={open} />
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
  const { openChat } = useModal();
  const href: string = `/chat/${chat.uuid}`;
  const name: string = getChatName(chat);
  const src: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const color: string = chat instanceof Group ? chat.color : chat instanceof PrivateChat ? chat.participant.user.color : "";
  const [menuPos, setMenuPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  const router = useRouter();
  const selected: string = router.query.uuid as string;
  const unread: number = chat.messages.values().filter(({ createdAt, sender }) => sender !== client.user.uuid && createdAt.getTime() > chat.lastRead.getTime()).length;
  const canManage: boolean = chat instanceof Group && (chat.members.get(client.user.uuid) instanceof Admin || chat.members.get(client.user.uuid) instanceof Owner);

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuPos({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => setMenuPos({ x: null, y: null });

  return (
    <>
      <Link href={href}>
        <div onContextMenu={handleRightClick} onClick={onClick} className={style["burger-item"]} aria-selected={chat.uuid === selected} data-unread={unread !== 0}>
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
              <Avatar className={style["avatar"]} src={src} style={{ backgroundColor: !src && color, width: "2rem", height: "2rem" }} />
            </Badge>
          </div>
          <div className={style["burger-text-container"]} data-open={open}>
            <h6 className={style["burger-text"]} children={name} />
            {chat instanceof Group && <GroupIcon className={style["icon"]} />}
          </div>
          {unread !== 0 && (
            <Badge badgeContent={unread} variant={"standard"} max={99} style={{ display: "flex", alignItems: "center" }} classes={{ badge: cn(style["burger-unread"], !open && style["closed"]) }} />
          )}
        </div>
      </Link>
      <Menu keepMounted open={menuPos.x !== null} onClose={handleMenuClose} anchorReference={"anchorPosition"} anchorPosition={menuPos.x === null ? undefined : { left: menuPos.x, top: menuPos.y }}>
        {unread !== 0 && <MenuItem children={"Mark As Read"} onClick={() => chat.readUntil(new Date())} autoClose onClose={handleMenuClose} />}
        {canManage && <MenuItem children={"Manage Group"} onClick={() => router.push(`/chat/${chat.uuid}/settings`)} autoClose onClose={handleMenuClose} />}
        <MenuItem children={"View Chat Info"} onClick={() => openChat(chat)} autoClose onClose={handleMenuClose} />
      </Menu>
    </>
  );
};

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default Burger;

import { Badge } from "@material-ui/core";
import { AddBox as AddIcon, ExitToApp as LogoutIcon, Group as GroupIcon, Menu as MenuIcon, Person as ProfileIcon, Search as ExploreIcon } from "@material-ui/icons";
import cn from "classnames";
import { Admin, Chat, ChatSocketEvent, Group, Owner, PrivateChat, UserSocketEvent } from "client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useBurger, useClient, useLang, useModal } from "../hooks";
import style from "../styles/modules/Burger.module.scss";
import Avatar from "./Avatar";
import Menu, { MenuItem } from "./Menu";
import Scrollbar from "./Scrollbar";

interface BurgerProps {
  onClick?: () => void;
}

const Burger: React.FC<BurgerProps> = ({ onClick }): JSX.Element => {
  const { client } = useClient();
  const { translation } = useLang();
  const { open, setOpen } = useBurger();
  const [, setUpdate] = useState<number>();

  const handleUpdate = () => setUpdate(Date.now());

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
    client.on(UserSocketEvent.MESSAGE_READ, handleUpdate);
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
      client.off(UserSocketEvent.MESSAGE_READ, handleUpdate);
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
        <Item open={open} icon={<MenuIcon />} text={""} onClick={() => setOpen(!open)} />
        <Item open={open} href={"/profile"} icon={<ProfileIcon />} text={translation.app.profile.burger_title} onClick={onClick} />
      </Section>
      {sortedChats.length !== 0 && (
        <Section>
          {sortedChats.map((chat: Chat) => {
            return <ChatItem open={open} chat={chat} key={chat.uuid} onClick={onClick} />;
          })}
        </Section>
      )}
      <Section>
        <Item open={open} href={"/explore"} icon={<ExploreIcon />} text={translation.app.explore.burger_title} onClick={onClick} />
        <Item open={open} href={"/create"} icon={<AddIcon />} text={translation.app.create.burger_title} onClick={onClick} />
        <Item open={open} href={"/"} icon={<LogoutIcon />} text={translation.app.logout} onClick={onClick} />
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
  const selected: boolean = href?.toLowerCase() === router.pathname.toLowerCase(); //boolean whether this is the select burger item

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
  const [, setUpdate] = useState<number>();
  const { translation } = useLang();
  const href: string = `/chat/${chat.uuid}`; //url to the chat
  const name: string = getChatName(chat); //name of the chat
  const src: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : ""; //url of the chat avatar
  const color: string = chat instanceof Group ? chat.color : chat instanceof PrivateChat ? chat.participant.user.color : ""; //color of the chat
  const [menuPos, setMenuPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  const router = useRouter();
  const selected: string = router.query.uuid as string; //uuid of the currently selected chat
  const unread: number = chat.messages.values().filter(({ createdAt, sender }) => sender !== client.user.uuid && createdAt.getTime() > chat.lastRead.getTime()).length; //amount of unread messages
  const canManage: boolean = chat instanceof Group && (chat.members.get(client.user.uuid) instanceof Admin || chat.members.get(client.user.uuid) instanceof Owner); //boolean whether the logged in user can manage this chat

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuPos({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => setMenuPos({ x: null, y: null });

  const markAsRead = () => {
    chat.readUntil(new Date()).then(() => setUpdate(Date.now()));
  };

  return (
    <>
      <Link href={href === router.asPath.toLowerCase() && canManage ? `${href}/settings` : href}>
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
              <Avatar color={color} className={style["avatar"]} src={src} style={{ height: "2rem", width: "2rem" }} />
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
        {unread !== 0 && <MenuItem children={translation.app.chat.mark_as_read} onClick={markAsRead} autoClose onClose={handleMenuClose} />}
        {canManage && <MenuItem children={translation.app.chat.manage_group} onClick={() => router.push(`/chat/${chat.uuid}/settings`)} autoClose onClose={handleMenuClose} />}
        <MenuItem children={translation.app.chat.view_info} onClick={() => openChat(chat)} autoClose onClose={handleMenuClose} />
      </Menu>
    </>
  );
};

/**
 * Function to get the name for a chat
 *
 * @param chat chat to get name for
 *
 * @returns string
 */

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default Burger;

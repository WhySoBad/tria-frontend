import { IconButton } from "@material-ui/core";
import { AddBox as AddChatIcon, Chat as ChatIcon, Group as GroupIcon, Person as ProfileIcon } from "@material-ui/icons";
import cn from "classnames";
import { Chat, ChatSocketEvent, Group, PrivateChat, User, UserPreview, UserSocketEvent } from "client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useChat, useClient, useLang, useModal } from "../../../hooks";
import baseStyle from "../../../styles/modules/Modal.module.scss";
import style from "../../../styles/modules/UserModal.module.scss";
import Avatar from "../../Avatar";
import Button from "../../Button";
import Menu, { MenuItem } from "../../Menu";
import Scrollbar from "../../Scrollbar";
import { BaseModal, ModalProps } from "../Modal";

interface UserModalProps extends ModalProps {
  user: User | UserPreview;
}

const UserModal: React.FC<UserModalProps> = ({ onClose, user, selectedTab = 0, ...rest }): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const { translation } = useLang();
  const { close } = useModal();
  const [tab, setTab] = useState<number>(0);
  const router = useRouter();
  const icons: Array<JSX.Element> = [];
  const [, setUpdate] = useState<number>();

  useEffect(() => {
    setTab(selectedTab);
  }, [selectedTab]);

  const handleUpdate = (userUuid: string) => userUuid === user.uuid && setUpdate(Date.now());

  useEffect(() => {
    let mounted: boolean = true;
    client.on(UserSocketEvent.USER_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_DELETE, onClose);
    client.on(ChatSocketEvent.PRIVATE_CREATE, () => mounted && setUpdate(Date.now()));
    client.on(ChatSocketEvent.GROUP_CREATE, () => mounted && setUpdate(Date.now()));
    client.on(ChatSocketEvent.CHAT_DELETE, () => mounted && setUpdate(Date.now()));
    return () => {
      mounted = false;
      client.off(UserSocketEvent.USER_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_DELETE, onClose);
      client.off(ChatSocketEvent.PRIVATE_CREATE, () => mounted && setUpdate(Date.now()));
      client.off(ChatSocketEvent.GROUP_CREATE, () => mounted && setUpdate(Date.now()));
      client.off(ChatSocketEvent.CHAT_DELETE, () => mounted && setUpdate(Date.now()));
    };
  }, []);

  if (!client || !user) return <></>;

  const privateChat: Chat | undefined = client.user.chats.values().find((chat) => {
    return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
  });
  const isSelf: boolean = user.uuid === client.user.uuid;

  const openChat = () => {
    if (privateChat) {
      if (selected === privateChat.uuid) close();
      else {
        router.push(`/chat/${privateChat.uuid}`);
        close();
      }
    }
  };

  const createChat = () => {
    client
      .createPrivateChat(user.uuid)
      .then((uuid: string) => {
        router.push(`/chat/${uuid}`);
        close();
      })
      .catch(client.error);
  };

  const openProfile = () => {
    router.push(`/profile`);
    close();
  };

  if (isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ProfileIcon className={baseStyle["icon"]} />} onClick={openProfile} />);
  else if (!privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<AddChatIcon className={baseStyle["icon"]} />} onClick={createChat} />);
  else if (privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ChatIcon className={baseStyle["icon"]} />} onClick={openChat} />);

  return (
    <BaseModal onClose={onClose} avatar={user.avatarURL} hex={user.color} uuid={user.uuid} name={user.name} tag={user.tag} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <h6 className={style["tab"]} aria-selected={tab === 0} onClick={() => setTab(0)} children={translation.modals.user.information} />
        <h6 className={style["tab"]} aria-selected={tab === 1} onClick={() => setTab(1)} children={translation.modals.user.chats} />
        {!privateChat && !isSelf && <h6 className={style["create-chat"]} children={<Button onClick={createChat} children={translation.modals.user.create_chat} />} />}
      </div>
      <section className={style["content"]}>
        {tab === 0 && <Informations user={user} />}
        {tab === 1 && <SharedChats user={user} />}
      </section>
    </BaseModal>
  );
};

interface InformationsProps {
  user: User | UserPreview;
}

const Informations: React.FC<InformationsProps> = ({ user }): JSX.Element => {
  const { translation } = useLang();
  const getTimeString = (date: Date): string => {
    if (user instanceof User) {
      const getString = (unit: { name: string; plural: string }, times: number): string => {
        const isMultiple: boolean = Math.floor(times) > 1;
        return `${translation.modals.time_prefix + " "}${Math.floor(times)} ${unit.name}${isMultiple ? unit.plural : ""}${" " + translation.modals.time_suffix}`;
      };

      const now: Date = new Date();
      const difference: number = now.getTime() - date.getTime();
      const minute: number = 60 * 1000;
      const hour: number = 60 * minute;
      const day: number = 24 * hour;
      const week: number = 7 * day;
      const month: number = 4 * week;
      const year: number = 12 * month;
      if (difference < 5 * minute) return translation.modals.user.just_now;
      else if (difference < hour) return getString(translation.modals.minute, difference / minute);
      else if (difference < day) return getString(translation.modals.hour, difference / hour);
      else if (difference < week) return getString(translation.modals.day, difference / day);
      else if (difference < month) return getString(translation.modals.week, difference / week);
      else if (difference < year) return getString(translation.modals.month, difference / month);
      else return getString(translation.modals.year, difference / year);
    } else return "";
  };

  return (
    <Scrollbar>
      <section className={style["informations-container"]} data-user={user instanceof User}>
        <InformationContainer className={style["name"]} title={translation.modals.user.name} children={user.name} />
        <InformationContainer className={style["tag"]} title={translation.modals.user.tag} children={`@${user.tag}`} />
        <InformationContainer className={style["description"]} title={translation.modals.user.description} children={user.description} />
        {user instanceof User && !user.online && <InformationContainer className={style["lastseen"]} title={translation.modals.user.last_seen} children={getTimeString(user.lastSeen)} />}
        {user instanceof User && <InformationContainer className={style["createdat"]} title={translation.modals.user.joined} children={getTimeString(user.createdAt)} />}
      </section>
    </Scrollbar>
  );
};

interface InformationContainerProps {
  className: string;
  title: string;
}

const InformationContainer: React.FC<InformationContainerProps> = ({ className, title, children }): JSX.Element => {
  return (
    <div className={cn(style["information-container"], className)}>
      <h6 className={style["information-title"]} children={title} />
      <div className={style["information-content"]} children={children} />
    </div>
  );
};

interface SharedChatsProps {
  user: User | UserPreview;
}

const SharedChats: React.FC<SharedChatsProps> = ({ user }): JSX.Element => {
  const { client } = useClient();
  const { translation } = useLang();
  const sharedChats: Array<Chat> = client.user.chats.values().filter((chat: Chat) => chat.members.get(user.uuid));

  if (sharedChats.length === 0 && user.uuid !== client.user.uuid) return <div className={style["no-shared"]} children={translation.modals.user.no_shared} />;

  return (
    <Scrollbar>
      {sharedChats.map((chat: Chat) => (
        <ChatItem user={user} chat={chat} key={chat.uuid} />
      ))}
    </Scrollbar>
  );
};

interface ChatItemProps {
  chat: Chat;
  user: User | UserPreview;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, user }): JSX.Element => {
  const { close, openChat, openUser } = useModal();
  const { translation } = useLang();
  const [menuPos, setMenuPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";
  const src: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const color: string = chat instanceof Group ? chat.color : chat instanceof PrivateChat ? chat.participant.user.color : "";

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuPos({ x: event.clientX, y: event.clientY });
  };

  const handleMenuClose = () => setMenuPos({ x: null, y: null });

  return (
    <div id={chat.uuid} className={style["item-container"]} onContextMenu={handleRightClick}>
      <Link href={`/chat/${chat.uuid}`}>
        <div className={style["item"]} onClick={close}>
          <Avatar className={style["avatar"]} src={src} color={color} />
          <div className={style["name"]}>
            <h6 children={name} />
            {chat instanceof Group && <GroupIcon className={style["icon"]} />}
          </div>
          <div children={`@${tag}`} className={style["tag"]} />
        </div>
      </Link>
      <Menu keepMounted open={menuPos.x !== null} onClose={handleMenuClose} anchorReference={"anchorPosition"} anchorPosition={menuPos.x === null ? undefined : { left: menuPos.x, top: menuPos.y }}>
        <MenuItem children={translation.app.chat.view_info} autoClose onClick={() => openChat(chat, { withBack: true, onClose: () => openUser(user, { selectedTab: 1 }) })} onClose={handleMenuClose} />
      </Menu>
    </div>
  );
};

export default UserModal;

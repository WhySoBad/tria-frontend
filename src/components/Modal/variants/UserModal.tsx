import { Avatar, IconButton } from "@material-ui/core";
import { Chat, User, UserPreview, Group, PrivateChat, ChatSocketEvent, UserSocketEvent } from "client";
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useChat } from "../../../hooks/ChatContext";
import { useClient } from "../../../hooks/ClientContext";
import style from "../../../styles/modules/UserModal.module.scss";
import baseStyle from "../../../styles/modules/Modal.module.scss";
import { BaseModal, ModalProps } from "../Modal";
import { useRouter } from "next/router";
import Scrollbar from "../../Scrollbar/Scrollbar";
import Link from "next/link";
import { useModal } from "../../../hooks/ModalContext";
import { Group as GroupIcon, Person as ProfileIcon, AddBox as AddChatIcon, Chat as ChatIcon } from "@material-ui/icons";
import Button from "../../Button/Button";

interface UserModalProps extends ModalProps {
  user: User | UserPreview;
}

const UserModal: React.FC<UserModalProps> = ({ onClose, user, ...rest }): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const { close } = useModal();
  const [tab, setTab] = useState<number>(0);
  const router = useRouter();
  const icons: Array<JSX.Element> = [];
  const [, setUpdate] = useState<number>();

  const handleUpdate = (userUuid: string) => userUuid === user.uuid && setUpdate(new Date().getTime());

  useEffect(() => {
    let mounted: boolean = true;
    client.on(UserSocketEvent.USER_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_DELETE, onClose);
    client.on(ChatSocketEvent.PRIVATE_CREATE, () => mounted && setUpdate(new Date().getTime()));
    client.on(ChatSocketEvent.GROUP_CREATE, () => mounted && setUpdate(new Date().getTime()));
    client.on(ChatSocketEvent.CHAT_DELETE, () => mounted && setUpdate(new Date().getTime()));
    return () => {
      mounted = false;
      client.off(UserSocketEvent.USER_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_DELETE, onClose);
      client.off(ChatSocketEvent.PRIVATE_CREATE, () => mounted && setUpdate(new Date().getTime()));
      client.off(ChatSocketEvent.GROUP_CREATE, () => mounted && setUpdate(new Date().getTime()));
      client.off(ChatSocketEvent.CHAT_DELETE, () => mounted && setUpdate(new Date().getTime()));
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

  const openProfile = () => router.push(`/profile`);

  if (isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ProfileIcon className={baseStyle["icon"]} />} onClick={openProfile} />);
  else if (!privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<AddChatIcon className={baseStyle["icon"]} />} onClick={createChat} />);
  else if (privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ChatIcon className={baseStyle["icon"]} />} onClick={openChat} />);

  return (
    <BaseModal onClose={onClose} avatar={user instanceof User ? user.avatarURL : ""} hex={user.color} uuid={user.uuid} name={user.name} tag={user.tag} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <h6 className={style["tab"]} aria-selected={tab === 0} onClick={() => setTab(0)} children={"Information"} />
        <h6 className={style["tab"]} aria-selected={tab === 1} onClick={() => setTab(1)} children={"Chats"} />
        {!privateChat && !isSelf && <h6 className={style["create-chat"]} children={<Button onClick={createChat} children={"Create Chat"} />} />}
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
  const getTimeString = (date: Date): string => {
    if (user instanceof User) {
      const getString = (unit: string, times: number): string => {
        const isMultiple: boolean = Math.floor(times) > 1;
        return `${Math.floor(times)} ${unit}${isMultiple ? "s" : ""} ago`;
      };

      const now: Date = new Date();
      const difference: number = now.getTime() - date.getTime();
      const minute: number = 60 * 1000;
      const hour: number = 60 * minute;
      const day: number = 24 * hour;
      const week: number = 7 * day;
      const month: number = 4 * week;
      const year: number = 12 * month;
      if (difference < 5 * minute) return "Just now";
      else if (difference < hour) return getString("minute", difference / minute);
      else if (difference < day) return getString("hour", difference / hour);
      else if (difference < week) return getString("day", difference / day);
      else if (difference < month) return getString("week", difference / week);
      else if (difference < year) return getString("month", difference / month);
      else return getString("year", difference / year);
    } else return "";
  };

  return (
    <Scrollbar>
      <section className={style["informations-container"]} data-user={user instanceof User}>
        <InformationContainer className={style["name"]} title={"Name"} children={user.name} />
        <InformationContainer className={style["tag"]} title={"Tag"} children={`@${user.tag}`} />
        <InformationContainer className={style["description"]} title={"Description"} children={user.description} />
        {user instanceof User && !user.online && <InformationContainer className={style["lastseen"]} title={"Last seen"} children={getTimeString(user.lastSeen)} />}
        {user instanceof User && <InformationContainer className={style["createdat"]} title={"Joined"} children={getTimeString(user.createdAt)} />}
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
  const sharedChats: Array<Chat> = client.user.chats.values().filter((chat: Chat) => chat.members.get(user.uuid));

  if (sharedChats.length === 0 && user.uuid !== client.user.uuid) return <div className={style["no-shared"]} children={"No shared chats"} />;

  return (
    <Scrollbar>
      {sharedChats.map((chat: Chat) => (
        <ChatItem chat={chat} key={chat.uuid} />
      ))}
    </Scrollbar>
  );
};

interface ChatItemProps {
  chat: Chat;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }): JSX.Element => {
  const { close } = useModal();
  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";
  const src: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const color: string = chat instanceof Group ? chat.color : chat instanceof PrivateChat ? chat.participant.user.color : "";

  return (
    <div id={chat.uuid} className={style["item-container"]} onClick={close}>
      <Link href={`/chat/${chat.uuid}`}>
        <div className={style["item"]}>
          <Avatar className={style["avatar"]} src={src} style={{ backgroundColor: color }} />
          <div className={style["name"]}>
            <h6 children={name} />
            {chat instanceof Group && <GroupIcon className={style["icon"]} />}
          </div>
          <div children={`@${tag}`} className={style["tag"]} />
        </div>
      </Link>
    </div>
  );
};

interface SharedContactsProps {
  user: User | UserPreview;
}

const SharedContacts: React.FC = ({}): JSX.Element => {
  return <></>;
};

export default UserModal;

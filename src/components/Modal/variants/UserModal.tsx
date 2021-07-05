import { Avatar, IconButton } from "@material-ui/core";
import { Chat, User, UserPreview, Group, PrivateChat } from "client";
import React, { useState } from "react";
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
import { Group as GroupIcon, Person as ProfileIcon, AddBox as AddChatIcon, Chat as ChatIcon, MoreVert as MoreIcon } from "@material-ui/icons";
import { useRef } from "react";
import Menu, { MenuItem } from "../../Menu/Menu";

interface UserModalProps extends ModalProps {
  user: User | UserPreview;
}

const UserModal: React.FC<UserModalProps> = ({ onClose, user, ...rest }): JSX.Element => {
  const { client } = useClient();
  const { selected, setSelected } = useChat();
  const { close } = useModal();
  const [tab, setTab] = useState<number>(0);
  const router = useRouter();
  const icons: Array<JSX.Element> = [];
  const moreRef = useRef<SVGSVGElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
      .then(() => {
        const privateChat: Chat | undefined = client.user.chats.values().find((chat) => {
          return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
        });
        setSelected(privateChat.uuid);
      })
      .catch(client.error);
  };

  const openMore = () => {
    setMenuOpen(true);
  };

  const openProfile = () => {};

  if (isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ProfileIcon className={baseStyle["icon"]} />} onClick={openProfile} />);
  else if (!privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<AddChatIcon className={baseStyle["icon"]} />} onClick={createChat} />);
  else if (privateChat && !isSelf) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<ChatIcon className={baseStyle["icon"]} />} onClick={openChat} />);
  icons.push(<IconButton className={baseStyle["iconbutton"]} children={<MoreIcon ref={moreRef} className={baseStyle["icon"]} />} onClick={openMore} />);

  return (
    <BaseModal onClose={onClose} avatar={user instanceof User ? user.avatarURL : ""} hex={user.color} uuid={user.uuid} name={user.name} tag={user.tag} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <div className={cn(style["tab"], tab === 0 && style["selected"])} onClick={() => setTab(0)}>
          Information
        </div>
        <div className={cn(style["tab"], tab === 1 && style["selected"])} onClick={() => setTab(1)}>
          Shared chats
        </div>
        <div className={cn(style["tab"], tab === 2 && style["selected"])} onClick={() => setTab(2)}>
          Shared contacts
        </div>
      </div>
      <section className={style["content"]}>
        <Scrollbar>{tab === 1 && <SharedChats user={user} />}</Scrollbar>
      </section>
      <Menu anchorEl={moreRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
      </Menu>
    </BaseModal>
  );
};

const Informations: React.FC = (): JSX.Element => {
  return <></>;
};

interface SharedChatsProps {
  user: User | UserPreview;
}

const SharedChats: React.FC<SharedChatsProps> = ({ user }): JSX.Element => {
  const { client } = useClient();
  const { close } = useModal();
  const sharedChats: Array<Chat> = user.uuid === client.user.uuid ? [] : client.user.chats.values().filter((chat: Chat) => chat.members.get(user.uuid));

  if (sharedChats.length === 0) return <div className={style["no-shared"]} children={"No shared chats"} />;

  return (
    <>
      {sharedChats.map((chat: Chat) => {
        const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
        const description: string = chat instanceof Group ? chat.description : chat instanceof PrivateChat ? chat.participant.user.description : "";
        return (
          <div className={style["item-container"]} key={chat.uuid} onClick={close}>
            <Link href={`/chat/${chat.uuid}`}>
              <div className={style["item"]}>
                <Avatar className={style["avatar"]} style={{ backgroundColor: chat.color }} alt={chat.uuid} children={chat.uuid.substr(0, 1)} />
                <div className={style["name"]}>
                  <h6 children={name} />
                  {chat instanceof Group && <GroupIcon className={style["icon"]} />}
                </div>
                <div children={description} className={style["description"]} />
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};

const SharedContacts: React.FC = ({}): JSX.Element => {
  return <></>;
};

export default UserModal;

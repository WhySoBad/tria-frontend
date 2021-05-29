import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import { Chat, User, UserPreview, Group, PrivateChat } from "client";
import React, { useState } from "react";
import cn from "classnames";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/UserModal.module.scss";
import modalStyle from "../../styles/modules/Modal.module.scss";
import { ModalContent, ModalHead, ModalProps } from "./BaseModal";
import { useRouter } from "next/router";
import Scrollbar from "../Scrollbar/Scrollbar";
import Link from "next/link";
import { useModal } from "../../hooks/ModalContext";
import { Group as GroupIcon, Edit as EditIcon, ChevronLeft as BackIcon, Close as CloseIcon, AddBox as AddChatIcon, Chat as ChatIcon, MoreVert as MoreIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({}));

interface UserModalProps extends ModalProps {
  user: User | UserPreview;
}

const UserModal: React.FC<UserModalProps> = ({ withBack = false, onClose, user }): JSX.Element => {
  const { client } = useClient();
  const { selected, setSelected } = useChat();
  const { close } = useModal();
  const [tab, setTab] = useState<number>(0);
  const router = useRouter();

  if (!client || !user) return <></>;

  const privateChat: Chat | undefined = client.user.chats.values().find((chat) => {
    return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
  });
  const own: boolean = user.uuid === client.user.uuid;

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

  const openMore = () => {};

  const openEdit = () => {};

  return (
    <>
      <ModalHead hex={user.color} avatar={user instanceof User ? user.avatarURL : ""} name={user.name} tag={user.tag} uuid={user.uuid}>
        {withBack && <IconButton className={modalStyle["back"]} children={<BackIcon className={modalStyle["icon"]} />} onClick={onClose} />}
        {privateChat && !own && <IconButton children={<ChatIcon className={modalStyle["icon"]} />} onClick={openChat} />}
        {!privateChat && !own && <IconButton children={<AddChatIcon className={modalStyle["icon"]} />} onClick={createChat} />}
        {own && <IconButton children={<EditIcon className={modalStyle["icon"]} />} onClick={openEdit} />}
        <IconButton children={<MoreIcon className={modalStyle["icon"]} />} onClick={openMore} />
        {!withBack && <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />}
      </ModalHead>
      <ModalContent noScrollbar>
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
      </ModalContent>
    </>
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

  return (
    <>
      {sharedChats.length === 0 ? (
        <div className={style["no-shared"]} children={"No shared chats"} />
      ) : (
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
      )}
    </>
  );
};

const SharedContacts: React.FC = ({}): JSX.Element => {
  return <></>;
};

export default UserModal;

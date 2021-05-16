import { IconButton, makeStyles } from "@material-ui/core";
import { Chat, PrivateChat, User, UserPreview } from "client";
import { SHA256 } from "crypto-js";
import React from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/UserModal.module.scss";
import modalStyle from "../../styles/modules/Modal.module.scss";
import MoreIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import AddChatIcon from "@material-ui/icons/AddBox";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import BackIcon from "@material-ui/icons/ChevronLeft";
import { ModalContainer, ModalContent, ModalHead, ModalProps } from "./BaseModal";

const useStyles = makeStyles((theme) => ({}));

interface UserModalProps extends ModalProps {
  user: User | UserPreview;
}

const UserModal: React.FC<UserModalProps> = ({ withBack = false, onClose, user }): JSX.Element => {
  const { client } = useClient();
  const { selected, setSelected } = useChat();

  if (!client || !user) return <></>;

  const privateChat: Chat | undefined = client.user.chats.values().find((chat) => {
    return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
  });

  const uuidHex: string = SHA256(user.uuid).toString().substr(0, 6);
  const own: boolean = user.uuid === client.user.uuid;

  const openChat = () => {
    if (privateChat) {
      if (selected === privateChat.uuid) onClose();
      else setSelected(privateChat.uuid);
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
      <ModalHead hex={uuidHex} name={user.name} tag={user.tag} uuid={user.uuid}>
        {withBack && <IconButton className={modalStyle["back"]} children={<BackIcon className={modalStyle["icon"]} />} onClick={onClose} />}
        {privateChat && !own && <IconButton children={<ChatIcon className={modalStyle["icon"]} />} onClick={openChat} />}
        {!privateChat && !own && <IconButton children={<AddChatIcon className={modalStyle["icon"]} />} onClick={createChat} />}
        {own && <IconButton children={<EditIcon className={modalStyle["icon"]} />} onClick={openEdit} />}
        <IconButton children={<MoreIcon className={modalStyle["icon"]} />} onClick={openMore} />
        <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />
      </ModalHead>
      <ModalContent>
        <div className={style["no-shared"]} children={"No shared chats"} />
      </ModalContent>
    </>
  );
};

export default UserModal;

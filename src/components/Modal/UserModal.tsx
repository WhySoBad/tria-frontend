import { Backdrop, Button, Fade, makeStyles, Modal } from "@material-ui/core";
import { Chat, Member, PrivateChat, User, UserPreview } from "client";
import React from "react";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/UserModal.module.scss";
import ChatInput from "../Chat/ChatInput";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

interface UserModalProps {
  user: User | UserPreview;
  open?: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ open = false, onClose, user }): JSX.Element => {
  const { client } = useClient();
  const { setSelected } = useChat();

  const classes = useStyles();
  const [privateChat]: [undefined] | [string, Chat] = client.user.chats.entries().find(([, chat]) => {
    return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
  }) || [undefined];

  const own: boolean = user.uuid === client.user.uuid;

  const handleClick = () => {
    if (own) return;
    if (privateChat) {
      setSelected(privateChat);
      onClose();
    } else {
      client
        .createPrivateChat(user.uuid)
        .then(() => {
          const [privateChat]: [undefined] | [string, Chat] = client.user.chats.entries().find(([, chat]) => {
            return chat instanceof PrivateChat && chat.participant.user.uuid === user.uuid;
          }) || [undefined];
          setSelected(privateChat);
        })
        .catch(client.error);
    }
  };

  return (
    <Modal className={classes.modal} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
      <Fade in={open}>
        <section className={style["container"]}>
          {user.uuid}
          <Button children={`${privateChat || own ? "Send message" : "Create chat"}`} onClick={handleClick} />
        </section>
      </Fade>
    </Modal>
  );
};

export default UserModal;

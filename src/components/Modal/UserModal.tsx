import { Avatar, Backdrop, Badge, Fade, IconButton, makeStyles, Modal } from "@material-ui/core";
import { Chat, PrivateChat, User, UserPreview } from "client";
import { SHA256 } from "crypto-js";
import React from "react";
import cn from "classnames";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/UserModal.module.scss";
import MoreIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import AddChatIcon from "@material-ui/icons/AddBox";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import BackIcon from "@material-ui/icons/ChevronLeft";

const useStyles = makeStyles((theme) => ({}));

interface UserModalProps {
  user: User | UserPreview;
  open?: boolean;
  withBack?: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ open = false, withBack = false, onClose, user }): JSX.Element => {
  const { client } = useClient();
  const { selected, setSelected } = useChat();
  const classes = useStyles();

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
    <Modal className={style["modal"]} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, invisible: withBack }}>
      <Fade in={open}>
        <section className={style["container"]}>
          <div className={style["head"]} style={{ background: `linear-gradient(176deg, #${uuidHex} 29%, rgba(0,0,0,1) 100%)` }}>
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={" "}
              color={"primary"}
              children={<Avatar variant={"rounded"} className={style["avatar"]} />}
            />
            <div className={style["text-container"]}>
              <h3 children={user.name} />
              <div className={style["tag"]}>
                <code children={`${user.tag}`} />
              </div>
            </div>
            <code children={user.uuid} className={style["uuid"]} />
            <div className={style["icon-container"]}>
              {withBack && <IconButton className={style["back"]} children={<BackIcon className={style["icon"]} />} onClick={onClose} />}
              {privateChat && !own && <IconButton children={<ChatIcon className={style["icon"]} />} onClick={openChat} />}
              {!privateChat && !own && <IconButton children={<AddChatIcon className={style["icon"]} />} onClick={createChat} />}
              {own && <IconButton children={<EditIcon className={style["icon"]} />} onClick={openEdit} />}
              <IconButton children={<MoreIcon className={style["icon"]} />} onClick={openMore} />
              <IconButton children={<CloseIcon className={style["icon"]} />} onClick={onClose} />
            </div>
          </div>
          <div className={style["content"]}>
            <div className={style["no-shared"]} children={"No shared chats"} />
          </div>
        </section>
      </Fade>
    </Modal>
  );
};

export default UserModal;

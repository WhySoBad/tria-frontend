import React, { useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Chat, Group, PrivateChat } from "client";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";

const ChatTitle: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const { openChat } = useModal();
  const chat: Chat | undefined = client?.user.chats.get(selected);

  if (!chat) return <></>;

  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";

  const canEdit: boolean = chat instanceof Group && chat.canEditGroup;

  return (
    <>
      <title children={name} />
      <div className={style["title-container"]} onClick={() => openChat(chat)}>
        <h3 children={name} />
      </div>
      <div className={style["icon-container"]}>
        {canEdit && <IconButton className={style["iconbutton"]} children={<SettingsIcon className={style["icon"]} />} />}
        <IconButton className={style["iconbutton"]} children={<MoreIcon className={style["icon"]} />} />
      </div>
    </>
  );
};

export default ChatTitle;

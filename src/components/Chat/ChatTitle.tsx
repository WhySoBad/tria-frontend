import React, { useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Chat, Group } from "client";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";

const ChatTitle: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const { openChat } = useModal();
  const chat: Chat | undefined = client?.user.chats.get(selected);

  const canEdit: boolean = chat instanceof Group ? chat.canEditGroup : true;

  return (
    <>
      <div className={style["title-container"]} onClick={() => openChat(chat)}>
        <h3 children={selected} />
      </div>
      <div className={style["icon-container"]}>
        {canEdit && <IconButton children={<SettingsIcon className={style["icon"]} />} />}
        <IconButton children={<MoreIcon className={style["icon"]} />} />
      </div>
    </>
  );
};

export default ChatTitle;

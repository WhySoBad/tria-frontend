import React, { useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import ChatModal from "../Modal/ChatModal";
import { Chat, Group } from "client";
import { useClient } from "../../hooks/ClientContext";

const ChatTitle: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();
  const [open, setOpen] = useState<boolean>(false);
  const chat: Chat | undefined = client?.user.chats.get(selected);

  const canEdit: boolean = chat instanceof Group ? chat.canEditGroup : true;

  return (
    <>
      <div className={style["title-container"]} onClick={() => setOpen(true)}>
        <h3 children={selected} />
      </div>
      <div className={style["icon-container"]}>
        {canEdit && <IconButton children={<SettingsIcon className={style["icon"]} />} />}
        <IconButton children={<MoreIcon className={style["icon"]} />} />
      </div>
      <ChatModal uuid={chat?.uuid} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ChatTitle;

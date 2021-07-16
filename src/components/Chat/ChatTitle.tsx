import React, { useRef, useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Admin, Chat, ChatSocketEvent, Group, Member, Owner, PrivateChat } from "client";
import { useClient } from "../../hooks/ClientContext";
import { useModal } from "../../hooks/ModalContext";
import Menu, { MenuItem } from "../Menu/Menu";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserSocketEvent } from "../../../../client/dist/src/websocket/types/UserSocket.types";

interface ChatTitleProps {
  settings?: boolean;
}

const ChatTitle: React.FC<ChatTitleProps> = ({ settings = false }): JSX.Element => {
  const { client } = useClient();
  const [, setUpdate] = useState<number>();
  const router = useRouter();
  const selected: string = router.query.uuid as string;
  const { openChat } = useModal();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const moreRef = useRef<SVGSVGElement>(null);
  const chat: Chat | undefined = client?.user.chats.get(selected);
  const member: Member | undefined = chat?.members.get(client.user.uuid);

  const handleUpdate = (chatUuid: string) => chatUuid === selected && setUpdate(new Date().getTime());
  const handleDelete = (chatUuid: string) => chatUuid === selected && router.push("/app");

  useEffect(() => {
    client.on(ChatSocketEvent.CHAT_EDIT, handleUpdate);
    client.on(ChatSocketEvent.CHAT_DELETE, handleDelete);
    client.on(ChatSocketEvent.CHAT_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_EDIT, handleUpdate);
    return () => {
      client.off(ChatSocketEvent.CHAT_EDIT, handleUpdate);
      client.off(ChatSocketEvent.CHAT_DELETE, handleDelete);
      client.off(ChatSocketEvent.CHAT_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_EDIT, handleUpdate);
    };
  }, []);

  if (!chat) return <></>;

  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";

  const canEdit: boolean = member instanceof Admin || member instanceof Owner;

  const menuAction = (handler: any) => setMenuOpen(false);

  const deleteChat = () => {
    if (chat instanceof PrivateChat) chat.delete().catch(client.error);
  };

  const redirect = () => {
    router.push(`/chat/${chat.uuid}${!settings ? "/settings" : ""}`);
  };

  return (
    <>
      <title children={name} />
      <h3 children={name} className={style["title"]} onClick={() => openChat(chat)} />
      <div className={style["icon-container"]}>
        {canEdit && <IconButton className={style["iconbutton"]} onClick={() => redirect()} children={<SettingsIcon className={style["icon"]} />} />}
        <IconButton className={style["iconbutton"]} children={<MoreIcon ref={moreRef} className={style["icon"]} />} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
      <Menu open={menuOpen} anchorEl={moreRef.current} onClose={() => setMenuOpen(false)}>
        <MenuItem children={"View Group Info"} onClick={() => menuAction(openChat(chat))} />
        {!settings && canEdit && <MenuItem children={"Manage Group"} onClick={() => menuAction(redirect())} />}
        {settings && <MenuItem children={"View Chat"} onClick={() => menuAction(redirect())} />}
        {!(member instanceof Owner) && chat instanceof Group && <MenuItem>Leave Group</MenuItem>}
        {chat instanceof PrivateChat && <MenuItem onClick={() => menuAction(deleteChat())}>Delete Chat</MenuItem>}
      </Menu>
    </>
  );
};

export default ChatTitle;

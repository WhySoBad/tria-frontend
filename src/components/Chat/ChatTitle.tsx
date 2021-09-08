import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Admin, Chat, ChatSocketEvent, Group, Member, Owner, PrivateChat, UserSocketEvent } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import { useModal } from "../../hooks/ModalContext";
import style from "../../styles/modules/Chat.module.scss";
import Menu, { MenuItem } from "../Menu";

interface ChatTitleProps {
  settings?: boolean;
}

const ChatTitle: React.FC<ChatTitleProps> = ({ settings = false }): JSX.Element => {
  const { client } = useClient();
  const [, setUpdate] = useState<number>();
  const router = useRouter();
  const { translation } = useLang();
  const selected: string = router.query.uuid as string;
  const { openChat } = useModal();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const moreRef = useRef<SVGSVGElement>(null);
  const chat: Chat | undefined = client?.user.chats.get(selected);
  const member: Member | undefined = chat?.members.get(client.user.uuid);

  const handleUpdate = (chatUuid: string) => chatUuid === selected && setUpdate(Date.now());
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

  const deleteChat = () => {
    chat
      .delete()
      .then(() => router.push("/app"))
      .catch(client.error);
  };

  const handleLeave = () => {
    client
      .leaveGroup(chat.uuid)
      .then(() => router.push("/app"))
      .catch(client.error);
  };

  const redirect = () => {
    router.push(`/chat/${chat.uuid}${!settings ? "/settings" : ""}`);
  };

  return (
    <>
      <h3 children={name} className={style["title"]} onClick={() => openChat(chat)} />
      <div className={style["icon-container"]}>
        {canEdit && <IconButton className={style["iconbutton"]} onClick={() => redirect()} children={<SettingsIcon className={style["icon"]} />} />}
        <IconButton className={style["iconbutton"]} children={<MoreIcon ref={moreRef} className={style["icon"]} />} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
      <Menu open={menuOpen} anchorEl={moreRef.current} onClose={() => setMenuOpen(false)}>
        <MenuItem children={translation.app.chat.view_info} autoClose onClick={() => openChat(chat)} onClose={setMenuOpen} />
        {!settings && canEdit && <MenuItem children={translation.app.chat.manage_group} autoClose onClick={() => redirect()} onClose={setMenuOpen} />}
        {settings && <MenuItem children={translation.app.chat.view_chat} autoClose onClick={() => redirect()} onClose={setMenuOpen} />}
        {!(member instanceof Owner) && chat instanceof Group && <MenuItem children={translation.app.chat.leave_group} autoClose onClick={() => handleLeave()} onClose={setMenuOpen} />}
        {member instanceof Owner && chat instanceof Group && <MenuItem autoClose onClick={() => deleteChat()} children={translation.app.chat.delete_group} onClose={setMenuOpen} />}
        {chat instanceof PrivateChat && <MenuItem autoClose onClick={() => deleteChat()} children={translation.app.chat.delete_chat} onClose={setMenuOpen} />}
      </Menu>
    </>
  );
};

export default ChatTitle;

import { Avatar, IconButton } from "@material-ui/core";
import { Admin, Chat, ChatSocketEvent, Group, Member, Owner, PrivateChat } from "client";
import React, { useState } from "react";
import style from "../../../styles/modules/ChatModal.module.scss";
import baseStyle from "../../../styles/modules/Modal.module.scss";
import { useClient } from "../../../hooks/ClientContext";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { BaseModal, ModalProps } from "../Modal";
import { useModal } from "../../../hooks/ModalContext";
import Scrollbar from "../../Scrollbar/Scrollbar";
import Menu, { MenuItem } from "../../Menu/Menu";
import { useRef } from "react";
import { useEffect } from "react";
import { UserSocketEvent } from "../../../../../client/dist/src/websocket/types/UserSocket.types";

interface ChatModalProps extends ModalProps {
  chat: Chat;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, chat, ...rest }) => {
  const { client } = useClient();
  const [, setUpdate] = useState<number>();

  const handleUpdate = (chatUuid: string) => chatUuid === chat.uuid && setUpdate(new Date().getTime());

  useEffect(() => {
    client.on(ChatSocketEvent.CHAT_EDIT, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_JOIN, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_LEAVE, handleUpdate);
    client.on(ChatSocketEvent.MEMBER_EDIT, handleUpdate);
    client.on(UserSocketEvent.USER_EDIT, handleUpdate);
    client.on(ChatSocketEvent.CHAT_DELETE, onClose);
    return () => {
      client.off(ChatSocketEvent.CHAT_EDIT, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_JOIN, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_LEAVE, handleUpdate);
      client.off(ChatSocketEvent.MEMBER_EDIT, handleUpdate);
      client.off(UserSocketEvent.USER_EDIT, handleUpdate);
      client.off(ChatSocketEvent.CHAT_DELETE, onClose);
    };
  }, []);

  const icons: Array<JSX.Element> = [];
  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";

  const canEdit: boolean = chat instanceof Group && chat.canEditGroup;

  const openMore = () => {};

  if (canEdit) icons.push(<IconButton className={baseStyle["iconbutton"]} children={<SettingsIcon className={baseStyle["icon"]} />} />);
  icons.push(<IconButton className={baseStyle["iconbutton"]} children={<MoreIcon className={baseStyle["icon"]} />} onClick={openMore} />);

  return (
    <BaseModal group={chat instanceof Group} avatar={chat instanceof Group ? chat.avatarURL : ""} hex={chat.color} uuid={chat.uuid} name={name} tag={tag} onClose={onClose} icons={icons} {...rest}>
      {chat instanceof PrivateChat && <div className={style["no-shared"]} children={"No shared chats"} />}
      {chat instanceof Group && <GroupContent group={chat} />}
    </BaseModal>
  );
};

interface GroupContentProps {
  group: Group;
}

const GroupContent: React.FC<GroupContentProps> = ({ group }): JSX.Element => {
  const owner: Array<Owner> = group?.members.values().filter((member: Member) => member instanceof Owner) || [];
  const admins: Array<Admin> = (group?.members.values().filter((member: Member) => member instanceof Admin) as any) || [];
  const members: Array<Member> = group?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin)) || [];

  return (
    <div className={style["content"]}>
      <Scrollbar>
        <div className={style["members"]}>
          <RoleBorder title={"owner"} />
          {owner.map((owner: Owner) => (
            <ChatMember chat={group} member={owner} key={owner.user.uuid} />
          ))}
          {admins.length !== 0 && (
            <>
              <RoleBorder title={"admin"} />
              {admins.map((admin: Admin) => (
                <ChatMember chat={group} member={admin} key={admin.user.uuid} />
              ))}
            </>
          )}
          <RoleBorder title={"member"} />
          {members.map((member: Member) => (
            <ChatMember chat={group} member={member} key={member.user.uuid} />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

interface RoleBorderProps {
  title: string;
}

const RoleBorder: React.FC<RoleBorderProps> = ({ title }): JSX.Element => {
  return (
    <>
      <div className={style["heading"]}>
        <div className={style["border"]} />
        <span className={style["title"]} children={title} />
      </div>
    </>
  );
};

interface ChatMemberProps {
  chat: Group;
  member: Member;
}

const ChatMember: React.FC<ChatMemberProps> = ({ member, chat }): JSX.Element => {
  const { client } = useClient();
  const { openMember, openChat } = useModal();
  const menuRef = useRef<SVGSVGElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const withMore: boolean = !(member instanceof Owner) && member.user.uuid !== client.user.uuid && (chat?.canBan || chat?.canEditMembers || chat?.canKick);

  useEffect(() => {
    !menuOpen && setEditOpen(false);
  }, [menuOpen]);

  const openMore = () => {
    setMenuOpen(true);
  };

  const handleBan = () => {};

  const handleKick = () => {};

  const handleEdit = () => {};

  return (
    <div className={style["item-container"]} data-open={menuOpen}>
      <div className={style["item"]} onClick={() => openMember(member, { withBack: true, onClose: () => openChat(chat) })}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL || ""} style={{ backgroundColor: member.user.color }} />
        <h6 children={member.user.name} className={style["title"]} />
        <div children={member.user.description} className={style["description"]} />
      </div>
      <div className={style["icon-container"]}>
        {withMore && <IconButton className={baseStyle["iconbutton"]} children={<MoreIcon ref={menuRef} className={baseStyle["icon"]} />} onClick={openMore} />}
      </div>
      <Menu anchorEl={menuRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        {chat.canKick && (
          <MenuItem onClick={handleKick} onClose={setMenuOpen}>
            Kick member
          </MenuItem>
        )}
        {chat.canBan && (
          <MenuItem onClick={handleBan} onClose={setMenuOpen}>
            Ban member
          </MenuItem>
        )}
        {chat.canEditMembers && (
          <MenuItem
            ref={editRef}
            onClick={handleEdit}
            onClose={setMenuOpen}
            nested={{
              open: false,
              children: (
                <>
                  <MenuItem children={"Test1"} />
                  <MenuItem children={"Test2"} />
                </>
              ),
            }}
          >
            Edit Member
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ChatModal;

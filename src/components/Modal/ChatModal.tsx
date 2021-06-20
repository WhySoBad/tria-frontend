import { Avatar, IconButton } from "@material-ui/core";
import { Admin, Chat, Group, Member, Owner, PrivateChat } from "client";
import React from "react";
import style from "../../styles/modules/ChatModal.module.scss";
import modalStyle from "../../styles/modules/Modal.module.scss";
import { useClient } from "../../hooks/ClientContext";
import { MoreVert as MoreIcon, Close as CloseIcon, Settings as SettingsIcon, Group as GroupIcon } from "@material-ui/icons";
import { ModalContent, ModalHead, ModalProps } from "./BaseModal";
import { useModal } from "../../hooks/ModalContext";
import Scrollbar from "../Scrollbar/Scrollbar";

interface ChatModalProps extends ModalProps {
  chat: Chat;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, chat }) => {
  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";

  const canEdit: boolean = chat instanceof Group && chat.canEditGroup;

  const owner: Array<Owner> = chat?.members.values().filter((member: Member) => member instanceof Owner);
  const admins: Array<Admin> = chat?.members.values().filter((member: Member) => member instanceof Admin) as any;
  const members: Array<Member> = chat?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin));

  const openMore = () => {};

  return (
    <>
      <ModalHead hex={chat?.color} avatar={chat instanceof PrivateChat ? chat.participant.user.avatarURL : ""} name={name} tag={tag} uuid={chat?.uuid} group={chat instanceof Group}>
        {canEdit && <IconButton children={<SettingsIcon className={modalStyle["icon"]} />} />}
        <IconButton children={<MoreIcon className={modalStyle["icon"]} />} onClick={openMore} />
        <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />
      </ModalHead>
      <ModalContent noScrollbar>
        {chat instanceof PrivateChat && <div className={style["no-shared"]} children={"No shared chats"} />}
        {chat instanceof Group && (
          <div className={style["content"]}>
            <Scrollbar>
              <div className={style["members"]}>
                <RoleBorder title={"owner"} />
                {owner.map((owner: Owner) => (
                  <ChatMember chat={chat} member={owner} key={owner.user.uuid} />
                ))}
                {admins.length !== 0 && (
                  <>
                    <RoleBorder title={"admin"} />
                    {admins.map((admin: Admin) => (
                      <ChatMember chat={chat} member={admin} key={admin.user.uuid} />
                    ))}
                  </>
                )}
                <RoleBorder title={"member"} />
                {members.map((member: Member) => (
                  <ChatMember chat={chat} member={member} key={member.user.uuid} />
                ))}
              </div>
            </Scrollbar>
          </div>
        )}
      </ModalContent>
    </>
  );
};

interface GroupModalProps extends ModalProps {
  chat: Group;
}

const GroupModal: React.FC<GroupModalProps> = ({ chat, onClose, withBack }): JSX.Element => {
  const openMore = () => {};

  const owner: Array<Owner> = chat?.members.values().filter((member: Member) => member instanceof Owner);
  const admins: Array<Admin> = chat?.members.values().filter((member: Member) => member instanceof Admin) as any;
  const members: Array<Member> = chat?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin));

  return (
    <>
      <ModalHead hex={chat?.color} avatar={chat instanceof PrivateChat ? chat.participant.user.avatarURL : ""} name={chat.name} tag={chat.tag} uuid={chat?.uuid} group={chat instanceof Group}>
        {chat.canEditGroup && <IconButton children={<SettingsIcon className={modalStyle["icon"]} />} />}
        <IconButton children={<MoreIcon className={modalStyle["icon"]} />} onClick={openMore} />
        <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />
      </ModalHead>
      <ModalContent noScrollbar>
        {chat instanceof PrivateChat && <div className={style["no-shared"]} children={"No shared chats"} />}
        {chat instanceof Group && (
          <div className={style["content"]}>
            <Scrollbar>
              <div className={style["members"]}>
                <RoleBorder title={"owner"} />
                {owner.map((owner: Owner) => (
                  <ChatMember chat={chat} member={owner} key={owner.user.uuid} />
                ))}
                {admins.length !== 0 && (
                  <>
                    <RoleBorder title={"admin"} />
                    {admins.map((admin: Admin) => (
                      <ChatMember chat={chat} member={admin} key={admin.user.uuid} />
                    ))}
                  </>
                )}
                <RoleBorder title={"member"} />
                {members.map((member: Member) => (
                  <ChatMember chat={chat} member={member} key={member.user.uuid} />
                ))}
              </div>
            </Scrollbar>
          </div>
        )}
      </ModalContent>
    </>
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

  const withMore: boolean = !(member instanceof Owner) && member.user.uuid !== client.user.uuid && (chat?.canBan || chat?.canEditMembers || chat?.canKick);

  const openMore = () => {};

  return (
    <div className={style["item-container"]}>
      <div className={style["item"]} onClick={() => openMember(member, { withBack: true, onClose: () => openChat(chat) })}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL || ""} style={{ backgroundColor: member.user.color }}>
          {member.user.uuid.substr(0, 1)}
        </Avatar>
        <h6 children={member.user.name} className={style["title"]} />
        <div children={member.user.description} className={style["description"]} />
      </div>
      <div className={style["icon-container"]}>{withMore && <IconButton children={<MoreIcon className={style["icon"]} />} onClick={openMore} />}</div>
    </div>
  );
};

export default ChatModal;

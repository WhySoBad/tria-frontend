import { Avatar, IconButton } from "@material-ui/core";
import { Admin, Chat, Group, Member, Owner, PrivateChat } from "client";
import { SHA256 } from "crypto-js";
import cn from "classnames";
import React, { useEffect, useState } from "react";
import style from "../../styles/modules/ChatModal.module.scss";
import modalStyle from "../../styles/modules/Modal.module.scss";
import { useClient } from "../../hooks/ClientContext";
import MemberModal from "./MemberModal";
import { MoreVert as MoreIcon, Close as CloseIcon, Settings as SettingsIcon, Group as GroupIcon } from "@material-ui/icons";
import { ModalContainer, ModalContent, ModalHead, ModalProps } from "./BaseModal";
import { useModal } from "../../hooks/ModalContext";

interface ChatModalProps extends ModalProps {
  chat: Chat;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, chat, withBack }) => {
  const { client } = useClient();

  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";
  const uuidHex: string = SHA256(chat?.uuid).toString().substr(0, 6);

  const canEdit: boolean = chat instanceof Group && chat.canEditGroup;

  const owner: Array<Owner> = chat?.members.values().filter((member: Member) => member instanceof Owner);
  const admins: Array<Admin> = chat?.members.values().filter((member: Member) => member instanceof Admin) as any;
  const members: Array<Member> = chat?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin));

  const openMore = () => {};

  return (
    <>
      <ModalHead hex={uuidHex} name={name} tag={tag} uuid={chat?.uuid} group={chat instanceof Group}>
        {canEdit && <IconButton children={<SettingsIcon className={modalStyle["icon"]} />} />}
        <IconButton children={<MoreIcon className={modalStyle["icon"]} />} onClick={openMore} />
        <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />
      </ModalHead>
      <ModalContent>
        {chat instanceof PrivateChat && <div className={style["no-shared"]} children={"No shared chats"} />}
        {chat instanceof Group && (
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
  chat: Chat;
  member: Member;
}

const ChatMember: React.FC<ChatMemberProps> = ({ member, chat }): JSX.Element => {
  const { client } = useClient();
  const { openMember, openChat } = useModal();
  const [open, setOpen] = useState<boolean>(false);

  const canEdit: boolean = (chat instanceof Group ? chat?.canEditMembers : true) && !(member instanceof Owner) && member.user.uuid !== client.user.uuid;
  const canBan: boolean = chat instanceof Group ? chat?.canBan : false;
  const canKick: boolean = chat instanceof Group ? chat?.canKick : false;

  const openMore = () => {};

  return (
    <div className={style["item-container"]}>
      <div className={style["item"]} onClick={() => openMember(member, { withBack: true, onClose: () => openChat(chat) })}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL || ""}>
          {member.user.uuid.substr(0, 1)}
        </Avatar>
        <h6 children={member.user.name} className={style["title"]} />
        <div children={member.user.description} className={style["description"]} />
      </div>
      <div className={style["icon-container"]}>{(canEdit || canBan || canKick) && <IconButton children={<MoreIcon className={style["icon"]} />} onClick={openMore} />}</div>
      {/*  <MemberModal member={member} open={open} onClose={() => setOpen(false)} withBack /> */}
    </div>
  );
};

export default ChatModal;

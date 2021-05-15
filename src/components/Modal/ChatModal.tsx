import { Avatar, Backdrop, Fade, IconButton, Modal } from "@material-ui/core";
import { Admin, Chat, Group, GroupRole, Member, Owner, PrivateChat } from "client";
import { SHA256 } from "crypto-js";
import cn from "classnames";
import React, { useEffect, useState } from "react";
import style from "../../styles/modules/ChatModal.module.scss";
import { useClient } from "../../hooks/ClientContext";
import MemberModal from "./MemberModal";
import { MoreVert as MoreIcon, Close as CloseIcon, Settings as SettingsIcon, Group as GroupIcon } from "@material-ui/icons";

interface ChatModalProps {
  uuid: string;
  open?: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ open, onClose, uuid }) => {
  const { client } = useClient();

  const chat = client.user.chats.get(uuid);

  useEffect(() => {
    onClose();
  }, [uuid]);

  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";
  const uuidHex: string = SHA256(chat?.uuid).toString().substr(0, 6);

  const canEdit: boolean = chat instanceof Group && chat.canEditGroup;

  const owner: Array<Owner> = chat?.members.values().filter((member: Member) => member instanceof Owner);
  const admins: Array<Admin> = chat?.members.values().filter((member: Member) => member instanceof Admin) as any;
  const members: Array<Member> = chat?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin));

  const openMore = () => {};

  return (
    <Modal className={style["modal"]} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
      <Fade in={open}>
        <section className={cn(style["container"], chat instanceof Group ? style["group"] : style["private"])}>
          <div className={cn(style["head"], chat instanceof Group ? style["group"] : style["private"])} style={{ background: `linear-gradient(176deg, #${uuidHex} 29%, rgba(0,0,0,1) 100%)` }}>
            <Avatar variant={"rounded"} className={style["avatar"]} />
            <div className={style["text-container"]}>
              <div className={style["name"]}>
                <h3 children={name} />
                {chat instanceof Group && <GroupIcon className={style["icon"]} />}
              </div>
              <div className={style["tag"]} children={<code children={tag} />} />
            </div>
            <code children={chat?.uuid} className={style["uuid"]} />
            <div className={style["icon-container"]}>
              {canEdit && <IconButton children={<SettingsIcon className={style["icon"]} />} />}
              <IconButton children={<MoreIcon className={style["icon"]} />} onClick={openMore} />
              <IconButton children={<CloseIcon className={style["icon"]} />} onClick={onClose} />
            </div>
          </div>
          <div className={cn(style["content"], chat instanceof Group ? style["group"] : style["private"])}>
            {chat instanceof PrivateChat && <div className={style["no-shared"]} children={"No shared chats"} />}
            {chat instanceof Group && (
              <div className={style["members"]}>
                <RoleBorder title={"owner"} />
                {owner.map((owner: Owner) => (
                  <ChatMember uuid={uuid} member={owner} key={owner.user.uuid} />
                ))}
                {admins.length !== 0 && (
                  <>
                    <RoleBorder title={"admin"} />
                    {admins.map((admin: Admin) => (
                      <ChatMember uuid={uuid} member={admin} key={admin.user.uuid} />
                    ))}
                  </>
                )}
                <RoleBorder title={"member"} />
                {members.map((member: Member) => (
                  <ChatMember uuid={uuid} member={member} key={member.user.uuid} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Fade>
    </Modal>
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
  uuid: string;
  member: Member;
}

const ChatMember: React.FC<ChatMemberProps> = ({ member, uuid }): JSX.Element => {
  const { client } = useClient();
  const [open, setOpen] = useState<boolean>(false);

  const chat: Chat | undefined = client.user.chats.get(uuid);

  const canEdit: boolean = (chat instanceof Group ? chat?.canEditMembers : true) && !(member instanceof Owner) && member.user.uuid !== client.user.uuid;

  const openMore = () => {};

  return (
    <div className={style["item-container"]}>
      <div className={style["item"]} onClick={() => !open && setOpen(true)}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL || ""}>
          {member.user.uuid.substr(0, 1)}
        </Avatar>
        <h6 children={member.user.name} className={style["title"]} />
        <div children={member.user.description} className={style["description"]} />
      </div>
      <div className={style["icon-container"]}>{canEdit && <IconButton children={<MoreIcon className={style["icon"]} />} onClick={openMore} />}</div>
      <MemberModal user={member.user} open={open} onClose={() => setOpen(false)} withBack />
    </div>
  );
};

export default ChatModal;

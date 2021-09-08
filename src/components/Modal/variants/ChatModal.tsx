import { IconButton } from "@material-ui/core";
import { MoreVert as MoreIcon, Settings as SettingsIcon } from "@material-ui/icons";
import cn from "classnames";
import { Admin, Chat, ChatSocketEvent, Group, Member, Owner, PrivateChat, UserSocketEvent } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";
import { useModal } from "../../../hooks/ModalContext";
import style from "../../../styles/modules/ChatModal.module.scss";
import baseStyle from "../../../styles/modules/Modal.module.scss";
import Avatar from "../../Avatar";
import Menu, { MenuItem } from "../../Menu";
import Scrollbar from "../../Scrollbar";
import { BaseModal, ModalProps } from "../Modal";

interface ChatModalProps extends ModalProps {
  chat: Chat;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, chat, selectedTab = 0, ...rest }) => {
  const { client } = useClient();
  const { translation } = useLang();
  const [, setUpdate] = useState<number>();
  const router = useRouter();
  const [tab, setTab] = useState<number>(selectedTab);

  const handleUpdate = (chatUuid: string) => chatUuid === chat.uuid && setUpdate(Date.now());

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
  const avatarURL: string = chat instanceof Group ? chat.avatarURL : chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const canEdit: boolean = chat.members.get(client.user.uuid) instanceof Owner || chat.members.get(client.user.uuid) instanceof Admin;
  const color: string = chat instanceof Group ? chat.color : chat instanceof PrivateChat ? chat.participant.user.color : "";
  const uuid: string = chat.uuid;

  if (canEdit) {
    icons.push(
      <IconButton
        className={baseStyle["iconbutton"]}
        onClick={() => {
          router.push(`/chat/${chat.uuid}/settings`);
          onClose && onClose();
        }}
        children={<SettingsIcon className={baseStyle["icon"]} />}
      />
    );
  }

  return (
    <BaseModal group={chat instanceof Group} avatar={avatarURL} hex={color} uuid={uuid} name={name} tag={tag} onClose={onClose} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <h6 className={style["tab"]} aria-selected={tab === 0} onClick={() => setTab(0)} children={translation.modals.chat.information} />
        <h6 className={style["tab"]} aria-selected={tab === 1} onClick={() => setTab(1)} children={translation.modals.chat.members} />
      </div>
      <section className={style["content"]}>
        {tab === 0 && <Informations chat={chat} />}
        {tab === 1 && (chat instanceof Group ? <GroupContent group={chat} /> : chat instanceof PrivateChat ? <PrivateChatContent chat={chat} /> : <></>)}
      </section>
    </BaseModal>
  );
};

interface GroupContentProps {
  group: Group;
}

const GroupContent: React.FC<GroupContentProps> = ({ group }): JSX.Element => {
  const { translation } = useLang();
  const owner: Array<Owner> = group?.members.values().filter((member: Member) => member instanceof Owner) || [];
  const admins: Array<Admin> = (group?.members.values().filter((member: Member) => member instanceof Admin) as any) || [];
  const members: Array<Member> = group?.members.values().filter((member: Member) => !(member instanceof Owner) && !(member instanceof Admin)) || [];

  return (
    <Scrollbar>
      <div className={style["members"]}>
        <RoleBorder title={translation.modals.chat.owner} />
        {owner.map((owner: Owner) => (
          <ChatMember chat={group} member={owner} key={owner.user.uuid} />
        ))}
        {admins.length !== 0 && (
          <>
            <RoleBorder title={translation.modals.chat.admin} />
            {admins.map((admin: Admin) => (
              <ChatMember chat={group} member={admin} key={admin.user.uuid} />
            ))}
          </>
        )}
        {members.length !== 0 && (
          <>
            <RoleBorder title={translation.modals.chat.member} />
            {members.map((member: Member) => (
              <ChatMember chat={group} member={member} key={member.user.uuid} />
            ))}
          </>
        )}
      </div>
    </Scrollbar>
  );
};

interface PrivateChatContentProps {
  chat: PrivateChat;
}

const PrivateChatContent: React.FC<PrivateChatContentProps> = ({ chat }): JSX.Element => {
  return (
    <Scrollbar>
      <div className={style["members"]}>
        {chat.members.values().map((member) => (
          <ChatMember chat={chat} member={member} key={member.user.uuid} />
        ))}
      </div>
    </Scrollbar>
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
  const { translation } = useLang();
  const { openMember, openChat } = useModal();
  const menuRef = useRef<SVGSVGElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const withMore: boolean = chat instanceof Group && !(member instanceof Owner) && member.user.uuid !== client.user.uuid && (chat?.canBan || chat?.canEditMembers || chat?.canKick);

  const handleBan = () => {
    if (chat instanceof Group && chat.canBan) chat.banMember(member).catch(client.error);
  };

  const handleKick = () => {
    if (chat instanceof Group && chat.canKick) chat.kickMember(member).catch(client.error);
  };

  return (
    <div className={style["item-container"]} data-open={menuOpen}>
      <div className={style["item"]} onClick={() => openMember(member, { withBack: true, onClose: () => openChat(chat, { selectedTab: 1 }) })}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL} color={member.user.color} />
        <h6 children={member.user.name} className={style["title"]} />
        <div children={`@${member.user.tag}`} className={style["tag"]} />
      </div>
      <div className={style["icon-container"]}>
        {withMore && <IconButton className={baseStyle["iconbutton"]} children={<MoreIcon ref={menuRef} className={baseStyle["icon"]} />} onClick={() => setMenuOpen(true)} />}
      </div>
      <Menu anchorEl={menuRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        {chat instanceof Group && chat.canKick && <MenuItem onClick={handleKick} onClose={setMenuOpen} children={translation.modals.chat.kick_member} />}
        {chat instanceof Group && chat.canBan && <MenuItem onClick={handleBan} onClose={setMenuOpen} children={translation.modals.chat.ban_member} />}
      </Menu>
    </div>
  );
};

interface InformationsProps {
  chat: Chat;
}

const Informations: React.FC<InformationsProps> = ({ chat }): JSX.Element => {
  const { translation } = useLang();
  const getTimeString = (date: Date): string => {
    const getString = (unit: { name: string; plural: string }, times: number): string => {
      const isMultiple: boolean = Math.floor(times) > 1;
      return `${translation.modals.time_prefix + " "}${Math.floor(times)} ${unit.name}${isMultiple ? unit.plural : ""}${" " + translation.modals.time_suffix}`;
    };

    const now: Date = new Date();
    const difference: number = now.getTime() - date.getTime();
    const minute: number = 60 * 1000;
    const hour: number = 60 * minute;
    const day: number = 24 * hour;
    const week: number = 7 * day;
    const month: number = 4 * week;
    const year: number = 12 * month;
    if (difference < 5 * minute) return translation.modals.user.just_now;
    else if (difference < hour) return getString(translation.modals.minute, difference / minute);
    else if (difference < day) return getString(translation.modals.hour, difference / hour);
    else if (difference < week) return getString(translation.modals.day, difference / day);
    else if (difference < month) return getString(translation.modals.week, difference / week);
    else if (difference < year) return getString(translation.modals.month, difference / month);
    else return getString(translation.modals.year, difference / year);
  };

  const name: string = chat instanceof Group ? chat.name : chat instanceof PrivateChat ? chat.participant.user.name : "";
  const tag: string = chat instanceof Group ? chat.tag : chat instanceof PrivateChat ? chat.participant.user.tag : "";
  const description: string = chat instanceof Group ? chat.description : chat instanceof PrivateChat ? chat.participant.user.description : "";

  return (
    <Scrollbar>
      <section className={style["informations-container"]}>
        <InformationContainer className={style["name"]} title={translation.modals.chat.name} children={name} />
        <InformationContainer className={style["tag"]} title={translation.modals.chat.tag} children={`@${tag}`} />
        <InformationContainer className={style["description"]} title={translation.modals.chat.description} children={description} />
        <InformationContainer className={style["members"]} title={translation.modals.chat.members} children={chat.members.size} />
        <InformationContainer className={style["createdat"]} title={translation.modals.chat.created} children={getTimeString(chat.createdAt)} />
      </section>
    </Scrollbar>
  );
};

interface InformationContainerProps {
  className: string;
  title: string;
}

const InformationContainer: React.FC<InformationContainerProps> = ({ className, title, children }): JSX.Element => {
  return (
    <div className={cn(style["information-container"], className)}>
      <h6 className={style["information-title"]} children={title} />
      <div className={style["information-content"]} children={children} />
    </div>
  );
};

export default ChatModal;

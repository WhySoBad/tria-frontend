import cn from "classnames";
import { ChatPreview, ChatType } from "client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";
import style from "../../../styles/modules/ChatPreview.module.scss";
import Button from "../../Button";
import Scrollbar from "../../Scrollbar";
import { BaseModal, ModalProps } from "../Modal";

interface ChatPreviewModalProps extends ModalProps {
  chat: ChatPreview;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({ chat, onClose, ...rest }): JSX.Element => {
  const { client } = useClient();
  const { translation } = useLang();
  const [tab, setTab] = useState<number>(0);
  const icons: Array<JSX.Element> = [];
  const router = useRouter();

  const handleGroupJoin = () => {
    if (client.user.chats.get(chat.uuid)) return;
    client
      .joinGroup(chat.uuid)
      .then(() => router.push(`/chat/${chat.uuid}`))
      .then(onClose)
      .catch(client.error);
  };

  return (
    <BaseModal group={chat.type === ChatType.GROUP} avatar={chat.avatarURL} hex={chat.color} uuid={chat.uuid} name={chat.name} tag={chat.tag} onClose={onClose} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <h6 className={style["tab"]} aria-selected={tab === 0} onClick={() => setTab(0)} children={translation.modals.chat_preview.information} />
        {!client.user.chats.get(chat.uuid) && <h6 className={style["join-group"]} children={<Button onClick={handleGroupJoin} children={translation.modals.chat_preview.join_group} />} />}
      </div>
      <section className={style["content"]}>{tab === 0 && <Informations chat={chat} />}</section>
    </BaseModal>
  );
};

interface InformationsProps {
  chat: ChatPreview;
}

const Informations: React.FC<InformationsProps> = ({ chat }): JSX.Element => {
  const { translation } = useLang();
  const name: string = chat.name || "";
  const tag: string = chat.tag || "";
  const description: string = chat.description || "";

  return (
    <Scrollbar>
      <section className={style["informations-container"]}>
        <InformationContainer className={style["name"]} title={translation.modals.chat_preview.name} children={name} />
        <InformationContainer className={style["tag"]} title={translation.modals.chat_preview.tag} children={`@${tag}`} />
        <InformationContainer className={style["description"]} title={translation.modals.chat_preview.description} children={description} />
        <InformationContainer className={style["members"]} title={translation.modals.chat_preview.members} children={chat.size} />
        <InformationContainer className={style["online"]} title={translation.modals.chat_preview.online} children={chat.online} />
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

export default ChatPreviewModal;

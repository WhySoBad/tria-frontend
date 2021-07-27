import React from "react";
import { ChatPreview, ChatType } from "client";
import { BaseModal, ModalProps } from "../Modal";
import style from "../../../styles/modules/ChatPreview.module.scss";
import { useState } from "react";
import Scrollbar from "../../Scrollbar/Scrollbar";
import cn from "classnames";
import { useClient } from "../../../hooks/ClientContext";
import Button from "../../Button/Button";
import { useRouter } from "next/router";

interface ChatPreviewModalProps extends ModalProps {
  chat: ChatPreview;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({ chat, onClose, ...rest }): JSX.Element => {
  const { client } = useClient();
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
    <BaseModal group={chat.type === ChatType.GROUP} avatar={""} hex={chat.color} uuid={chat.uuid} name={chat.name} tag={chat.tag} onClose={onClose} icons={icons} {...rest}>
      <div className={style["tabs"]}>
        <h6 className={style["tab"]} aria-selected={tab === 0} onClick={() => setTab(0)} children={"Information"} />
        {!client.user.chats.get(chat.uuid) && <h6 className={style["join-group"]} children={<Button onClick={handleGroupJoin} children={"Join Group"} />} />}
      </div>
      <section className={style["content"]}>{tab === 0 && <Informations chat={chat} />}</section>
    </BaseModal>
  );
};

interface InformationsProps {
  chat: ChatPreview;
}

const Informations: React.FC<InformationsProps> = ({ chat }): JSX.Element => {
  const name: string = chat.name || "";
  const tag: string = chat.tag || "";
  const description: string = chat.description || "";

  return (
    <Scrollbar>
      <section className={style["informations-container"]}>
        <InformationContainer className={style["name"]} title={"Name"} children={name} />
        <InformationContainer className={style["tag"]} title={"Tag"} children={`@${tag}`} />
        <InformationContainer className={style["description"]} title={"Description"} children={description} />
        <InformationContainer className={style["members"]} title={"Members"} children={chat.size} />
        <InformationContainer className={style["online"]} title={"Online"} children={chat.online} />
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

import React from "react";
import { ChatPreview, ChatType } from "client";
import { BaseModal, ModalProps } from "../Modal";
import baseStyle from "../../../styles/modules/Modal.module.scss";

interface ChatPreviewModalProps extends ModalProps {
  chat: ChatPreview;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({ chat, onClose, ...rest }): JSX.Element => {
  const icons: Array<JSX.Element> = [];

  return <BaseModal group={chat.type === ChatType.GROUP} avatar={""} hex={chat.color} uuid={chat.uuid} name={chat.name} tag={chat.tag} onClose={onClose} icons={icons} {...rest}></BaseModal>;
};

export default ChatPreviewModal;

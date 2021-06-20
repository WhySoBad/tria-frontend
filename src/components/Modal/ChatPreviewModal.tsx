import React from "react";
import { ChatPreview, ChatType } from "../../../../client/dist/src";
import { ModalContent, ModalHead, ModalProps } from "./BaseModal";
import { IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import modalStyle from "../../styles/modules/Modal.module.scss";

interface ChatPreviewModalProps extends ModalProps {
  chat: ChatPreview;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({ chat, onClose }): JSX.Element => {
  return (
    <>
      <ModalHead group={chat.type === ChatType.GROUP} avatar={""} hex={chat.color} uuid={chat.uuid} name={chat.name} tag={chat.tag}>
        <IconButton children={<CloseIcon className={modalStyle["icon"]} />} onClick={onClose} />
      </ModalHead>
      <ModalContent noScrollbar></ModalContent>
    </>
  );
};

export default ChatPreviewModal;

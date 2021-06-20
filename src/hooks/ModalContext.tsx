import { Chat, ChatPreview, Member, User, UserPreview } from "client";
import { NextPage } from "next";
import React, { useState } from "react";
import { ModalContainer, ModalProps } from "../components/Modal/BaseModal";
import ChatModal from "../components/Modal/ChatModal";
import ChatPreviewModal from "../components/Modal/ChatPreviewModal";
import MemberModal from "../components/Modal/MemberModal";
import UserModal from "../components/Modal/UserModal";

interface ModalContext {
  openUser: (user: User, props?: ModalProps) => void;
  openChat: (chat: Chat, props?: ModalProps) => void;
  openMember: (member: Member, props?: ModalProps) => void;
  openChatPreview: (chat: ChatPreview, props?: ModalProps) => void;
  close: () => void;
}

const defaultValue: ModalContext = {
  openUser: () => {},
  openChat: () => {},
  openMember: () => {},
  openChatPreview: () => {},
  close: () => {},
};

export const ModalContext = React.createContext<ModalContext>(defaultValue);

export const ModalProvider: NextPage = ({ children }): JSX.Element => {
  const [open, setOpen] = useState<User | UserPreview | Chat | Member | ChatPreview>(null);
  const [props, setProps] = useState<ModalProps>({});
  const [closed, setClosed] = useState<boolean>(true);

  const openUser = (user: User, props: ModalProps = {}) => {
    setOpen(user);
    setProps(props);
    setClosed(false);
  };
  const openChat = (chat: Chat, props: ModalProps = {}) => {
    setOpen(chat);
    setProps(props);
    setClosed(false);
  };

  const openMember = (member: Member, props: ModalProps = {}) => {
    setOpen(member);
    setProps(props);
    setClosed(false);
  };

  const openChatPreview = (chat: ChatPreview, props: ModalProps = {}) => {
    setOpen(chat);
    setProps(props);
    setClosed(false);
  };

  const close = () => {
    setClosed(true);
  };

  return (
    <ModalContext.Provider
      value={{
        openUser: openUser,
        openChat: openChat,
        openMember: openMember,
        openChatPreview: openChatPreview,
        close: close,
      }}
    >
      <ModalContainer open={!closed} onClose={close}>
        {open instanceof Chat && (
          <ChatModal
            chat={open instanceof Chat ? open : null}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
          />
        )}
        {open && !(open instanceof Chat) && (open as any).type && (
          <ChatPreviewModal
            chat={open as any}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
          />
        )}
        {open instanceof Member && (
          <MemberModal
            member={open instanceof Member ? open : null}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
          />
        )}
        {open instanceof User && (
          <UserModal
            user={open instanceof User ? open : null}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
          />
        )}
      </ModalContainer>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

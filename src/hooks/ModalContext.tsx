import { Chat, ChatPreview, Member, User, UserPreview } from "client";
import { NextPage } from "next";
import React, { useState } from "react";
import { ModalContainer, ModalProps } from "../components/Modal/Modal";
import { ChatPreviewModal, ChatModal, MemberModal, UserModal } from "../components/Modal/variants";

interface ModalContext {
  openUser: (user: User | UserPreview, props?: ModalProps) => void;
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
  const [type, setType] = useState<"User" | "Chat" | "ChatPreview" | "Member">();
  const [props, setProps] = useState<ModalProps>({});
  const [closed, setClosed] = useState<boolean>(true);

  const openUser = (user: User | UserPreview, props: ModalProps = {}) => {
    setType("User");
    setOpen(user);
    setProps(props);
    setClosed(false);
  };
  const openChat = (chat: Chat, props: ModalProps = {}) => {
    setType("Chat");
    setOpen(chat);
    setProps(props);
    setClosed(false);
  };

  const openMember = (member: Member, props: ModalProps = {}) => {
    setType("Member");
    setOpen(member);
    setProps(props);
    setClosed(false);
  };

  const openChatPreview = (chat: ChatPreview, props: ModalProps = {}) => {
    setType("ChatPreview");
    setOpen(chat);
    setProps(props);
    setClosed(false);
  };

  const close = () => {
    setClosed(true);
    setOpen(null);
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
        {type === "Chat" && open && (
          <ChatModal
            chat={open as any}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
            selectedTab={props.selectedTab}
          />
        )}
        {type === "ChatPreview" && open && (
          <ChatPreviewModal
            chat={open as any}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
            selectedTab={props.selectedTab}
          />
        )}
        {type === "Member" && open && (
          <MemberModal
            member={open as any}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
            selectedTab={props.selectedTab}
          />
        )}
        {type === "User" && open && (
          <UserModal
            user={open as any}
            withBack={props.withBack}
            onClose={() => {
              if (props.onClose) props.onClose();
              else close();
            }}
            selectedTab={props.selectedTab}
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

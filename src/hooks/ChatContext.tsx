import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface ChatContext {
  selected: string;
  setSelected: (chat: string) => void;
  update: () => void;
  updated: number;
}

const defaultValue: ChatContext = {
  selected: "",
  setSelected: () => {},
  update: () => {},
  updated: 0,
};

export const ChatContext = React.createContext<ChatContext>(defaultValue);

export const ChatProvider: NextPage = ({ children }): JSX.Element => {
  const router = useRouter();
  const [chat, setChat] = useState<string>(router.query.uuid as string);
  const [updated, setUpdate] = useState<number>();

  const update: () => void = (): void => {
    setUpdate(new Date().getTime());
  };

  return (
    <ChatContext.Provider
      value={{
        setSelected: setChat,
        update: update,
        selected: chat,
        updated: updated,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

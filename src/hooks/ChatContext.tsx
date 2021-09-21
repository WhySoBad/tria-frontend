import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface ChatContext {
  selected: string;
  setSelected: (chat: string) => void;
}

const defaultValue: ChatContext = {
  selected: "",
  setSelected: () => {},
};

export const ChatContext = React.createContext<ChatContext>(defaultValue);

export const ChatProvider: NextPage = ({ children }): JSX.Element => {
  const router = useRouter();
  const [chat, setChat] = useState<string>(router.query.uuid as string);

  return (
    <ChatContext.Provider
      value={{
        setSelected: setChat,
        selected: chat,
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

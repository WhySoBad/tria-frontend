import { Avatar, ButtonBase, makeStyles } from "@material-ui/core";
import { Chat, Group, Member, Message, PrivateChat } from "client";
import React from "react";
import style from "../../styles/modules/Chat.module.scss";
import cn from "classnames";
import { useClient } from "../../hooks/ClientContext";
import { useChat } from "../../hooks/ChatContext";
import Scrollbars from "react-custom-scrollbars-2";

const useStyles = makeStyles((theme) => ({}));

const ChatList: React.FC = (): JSX.Element => {
  const { client } = useClient();

  return (
    <Scrollbars
      autoHide
      renderView={(props) => <div {...props} style={{ ...props.style, overflowX: "hidden" }} />}
      renderThumbVertical={(props) => <div {...props} className={style["scroll-thumb"]} />}
    >
      {client?.user.chats
        .values()
        .sort((a, b) => {
          const lastA: Message = a.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
          const lastB: Message = b.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
          return lastB?.createdAt.getTime() - lastA?.createdAt.getTime();
        })
        .map((chat: Chat) => (
          <ChatContainer key={chat.uuid} uuid={chat.uuid} />
        ))}
    </Scrollbars>
  );
};

interface ChatContainerProps {
  uuid: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ uuid }): JSX.Element => {
  const { client } = useClient();
  const { selected, setSelected } = useChat();

  const classes = useStyles();

  const chat: Chat | undefined = client.user.chats.get(uuid);
  const name: string = getChatName(chat);
  const avatarSrc: string = chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const lastMessage: Message | undefined = chat.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const lastSender: Member | undefined = chat.members.get(lastMessage?.sender);

  return (
    <ButtonBase className={cn(style["item"], selected === uuid && style["selected"])} onClick={() => setSelected(uuid)}>
      <Avatar className={style["avatar"]} src={avatarSrc}>
        {chat.uuid.substr(0, 1)}
      </Avatar>
      <h6 children={name} className={style["title"]} />
      <div className={style["description"]}>
        {lastSender && <code children={lastSender.user.name + ":"} className={style["sender"]} />}
        <code children={lastMessage?.text || "Chat created"} className={style["text"]} />
      </div>
    </ButtonBase>
  );
};

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default ChatList;

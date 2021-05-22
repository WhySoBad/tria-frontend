import { Avatar, ButtonBase, makeStyles } from "@material-ui/core";
import { Chat, Group, Member, Message, PrivateChat } from "client";
import React from "react";
import style from "../../styles/modules/Chat.module.scss";
import cn from "classnames";
import { useClient } from "../../hooks/ClientContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Scrollbar from "../Scrollbar/Scrollbar";

const useStyles = makeStyles((theme) => ({}));

const ChatList: React.FC = (): JSX.Element => {
  const { client } = useClient();

  return (
    <Scrollbar>
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
    </Scrollbar>
  );
};

interface ChatContainerProps {
  uuid: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ uuid }): JSX.Element => {
  const { client } = useClient();

  const router = useRouter();
  const selected: string = router.query.uuid as string;

  const classes = useStyles();

  const chat: Chat | undefined = client.user.chats.get(uuid);
  const name: string = getChatName(chat);
  const avatarSrc: string = chat instanceof PrivateChat ? chat.participant.user.avatarURL : "";
  const lastMessage: Message | undefined = chat.messages.values().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const lastSender: Member | undefined = chat.members.get(lastMessage?.sender);

  return (
    <Link href={`/app/chat/${uuid}`}>
      <ButtonBase disableRipple className={cn(style["item"], selected === uuid && style["selected"])}>
        <Avatar className={style["avatar"]} src={avatarSrc} style={{ backgroundColor: chat.color }} alt={name} />
        <h6 children={name} className={style["title"]} />
        <div className={style["description"]}>
          {lastSender && <code children={lastSender.user.name + ":"} className={style["sender"]} />}
          <code children={lastMessage?.text || "Chat created"} className={style["text"]} />
        </div>
      </ButtonBase>
    </Link>
  );
};

const getChatName: (chat: Chat) => string = (chat: Chat): string => {
  if (chat instanceof Group) return chat.name;
  else if (chat instanceof PrivateChat) {
    return chat.participant.user.name;
  }
};

export default ChatList;

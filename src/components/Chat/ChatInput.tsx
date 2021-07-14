import { makeStyles, TextField } from "@material-ui/core";
import cn from "classnames";
import { Chat } from "client";
import React, { useState } from "react";
import style from "../../styles/modules/Chat.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "green",
      },
    },
  },
}));

const ChatInput: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>();
  const { client } = useClient();
  const { selected, update } = useChat();
  const classes = useStyles();

  const chat: Chat | undefined = client?.user.chats.get(selected);

  if (!chat) return <></>;

  return (
    <div className={style["input-container"]}>
      <TextField
        value={text}
        multiline
        variant={"outlined"}
        className={cn(style["input-content"], classes.root)}
        inputProps={{ className: style["input"] }}
        placeholder={"Say hello"}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          setText(event.target.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (Boolean(text)) {
              chat
                .sendMessage(text)
                .then(() => {
                  setText("");
                  update();
                })
                .catch((err) => client.error(err));
            }
          }
        }}
      />
    </div>
  );
};

export default ChatInput;

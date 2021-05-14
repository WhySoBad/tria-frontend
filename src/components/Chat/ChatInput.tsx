import { makeStyles, TextField } from "@material-ui/core";
import cn from "classnames";
import { Chat } from "client";
import React, { useState } from "react";
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
  container: {
    padding: "0.5rem",
    marginRight: "3.75rem",
    marginLeft: "3.75rem",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    borderColor: "#fff !important",
  },
}));

interface ChatInputProps {}

const ChatInput: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>();
  const { client } = useClient();
  const { selected, update } = useChat();
  const classes = useStyles();

  const chat: Chat | undefined = client?.user.chats.get(selected);

  if (!chat) return <></>;

  return (
    <div className={classes.container}>
      <TextField
        value={text}
        multiline
        variant={"outlined"}
        className={cn(classes.inputContainer, classes.root)}
        inputProps={{ className: classes.input }}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          setText(event.target.value);
        }}
        onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (Boolean(text)) {
              chat
                .sendMessage(text)
                .then(update)
                .catch((err) => client.error(err));
            }
            setText("");
          }
        }}
      />
    </div>
  );
};

export default ChatInput;

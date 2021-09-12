import { IconButton, InputBase, useMediaQuery } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { Chat } from "client";
import React, { useEffect, useRef, useState } from "react";
import { useBurger } from "../../hooks/BurgerContext";
import { useChat } from "../../hooks/ChatContext";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Chat.module.scss";

const ChatInput: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { open } = useBurger();
  const matches = useMediaQuery("(min-width: 800px)");
  const { client } = useClient();
  const { selected } = useChat();
  const { translation } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (matches && inputRef.current) inputRef.current.focus();
  }, [selected, inputRef.current, open]);

  const chat: Chat | undefined = client?.user.chats.get(selected);

  const isValid = (): boolean => {
    if (!Boolean(text)) return false;
    const replaced: string = text.replace("\n", "");
    if (!Boolean(replaced)) return false;
    return true;
  };

  if (!chat) return <></>;

  const handleSend = () => {
    if (!isValid()) return;
    chat
      .sendMessage(text)
      .then(() => setText(""))
      .catch(client.error);
  };

  return (
    <div className={style["chat-input-container"]}>
      <div className={style["input-container"]}>
        <InputBase
          inputRef={inputRef}
          rowsMax={4}
          spellCheck={false}
          fullWidth
          value={text}
          multiline
          autoFocus={matches}
          classes={{ root: style["input"], error: style["error"], disabled: style["disabled"], focused: style["focus"], inputMultiline: style["multiline"] }}
          placeholder={translation.app.chat.new_message}
          onChange={({ target: { value } }) => setText(value)}
          onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          endAdornment={<IconButton disabled={!isValid()} onClick={handleSend} className={style["iconbutton"]} children={<SendIcon data-disabled={!isValid()} className={style["send"]} />} />}
        />
      </div>
      <div className={style["send-container"]} />
    </div>
  );
};

export default ChatInput;

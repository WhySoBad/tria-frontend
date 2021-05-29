import React from "react";
import style from "../../styles/modules/Chat.module.scss";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from "@material-ui/core";

const ChatHeader: React.FC = (): JSX.Element => {
  return (
    <>
      <section className={style["burger"]}>
        <IconButton children={<MenuIcon className={style["icon"]} />} />
      </section>
      <section className={style["profile"]}></section>
    </>
  );
};

export default ChatHeader;

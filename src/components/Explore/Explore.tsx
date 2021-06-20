import React, { useEffect, useRef, useState } from "react";
import { ChatPreview, ChatType } from "../../../../client/dist/src";
import { Avatar } from "@material-ui/core";
import Scrollbar from "../Scrollbar/Scrollbar";
import style from "../../styles/modules/Explore.module.scss";
import { Searchbar } from "../Input/Input";
import Scrollbars from "react-custom-scrollbars-2";
import { useModal } from "../../hooks/ModalContext";

const props: ChatPreview = {
  color: "#1fcc58",
  description: "Test description",
  name: "Testname",
  online: 13,
  size: 24,
  tag: "groupTag",
  type: ChatType.GROUP,
  uuid: "f67e0e20-81bd-4320-ad96-d8ebcf711b8e",
};

const items: Array<ChatPreview> = new Array(100).fill(props).map(({ color, ...rest }) => {
  const r: number = Math.round(Math.random() * 255);
  const g: number = Math.round(Math.random() * 255);
  const b: number = Math.round(Math.random() * 255);
  return { color: "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1), ...rest };
});

interface ExploreProps {
  type: "USER" | "CHAT";
}

const Explore: React.FC<ExploreProps> = ({ type }): JSX.Element => {
  const scrollRef = useRef<Scrollbars>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const title: string = type === "USER" ? "Search User" : "Search Chat";
  const subtitle: string = type === "USER" ? "Find new Users to chat with" : "Join and find new Chats";

  return (
    <main className={style["container"]}>
      <div className={style["title-container"]} ref={titleRef} style={{ height: `calc(100% - ${Math.round(height / 5)}%)`, justifyContent: Math.round(height / 5) >= 95 ? "flex-start" : "center" }}>
        <div className={style["title-content"]} style={{ flexDirection: Math.round(height / 5) >= 95 ? "row" : "column" }}>
          <h3 className={style["title"]} children={title} style={{ width: Math.round(height / 5) >= 95 && "calc(100% / 3)" }} />
          <h5 className={style["subtitle"]} children={subtitle} style={{ display: Math.round(height / 5) >= 95 && "none" }} />
          <div className={style["searchbar"]}>
            <Searchbar onChange={debounce(handleChange, 500)} />
          </div>
          <div style={{ width: "calc(100% / 3)" }} />
        </div>
      </div>
      <Scrollbar
        reference={scrollRef}
        onScroll={() => {
          if (scrollRef?.current?.getScrollTop() / 5 === height / 5) return;
          if (scrollRef?.current?.getScrollTop() / 5 <= 100) setHeight(scrollRef?.current?.getScrollTop());
          else if (height < 500) setHeight(500);
        }}
      >
        <section className={style["content-container"]}>
          {items.map((value, index) => (
            <ChatItem chat={value} key={index} />
          ))}
        </section>
      </Scrollbar>
    </main>
  );
};

interface ChatItemProps {
  chat: ChatPreview;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }): JSX.Element => {
  const { openChatPreview } = useModal();

  return (
    <div className={style["item"]} onClick={() => openChatPreview(chat)}>
      <div className={style["item-container"]}>
        <div className={style["head"]} style={{ background: `linear-gradient(176deg, ${chat.color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} style={{ backgroundColor: chat.color }} />
          <div className={style["text-container"]}>
            <div className={style["name"]}>
              <h4 children={chat.name} />
            </div>
            <div className={style["tag"]}>
              <code className={style["at"]} children={"#"} />
              <code children={`${chat.tag}`} />
            </div>
          </div>
          {/*  <code children={chat.uuid} className={style["uuid"]} /> */}
        </div>
        {/*   <div className={style["content"]}>
          <div className={style["member-container"]}></div>
          <div className={style["text"]} children={chat.description} />
        </div> */}
      </div>
    </div>
  );
};

/**
 * Simple function to make a debounced input
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns Function
 */

const debounce = (handler: any, delay: number): any => {
  let timeout: NodeJS.Timeout;
  const wrapper = (...args: Array<any>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler(...args);
    }, delay);
  };
  return wrapper;
};

export default Explore;

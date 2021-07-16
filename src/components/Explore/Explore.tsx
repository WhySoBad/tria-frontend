import React, { useEffect, useRef, useState } from "react";
import { ChatPreview, SearchOptions, UserPreview } from "../../../../client/dist/src";
import { Avatar } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ViewList as ViewListIcon, ViewModule as ViewModuleIcon, Group as GroupIcon } from "@material-ui/icons";
import Scrollbar from "../Scrollbar/Scrollbar";
import style from "../../styles/modules/Explore.module.scss";
import { Searchbar } from "../Input/Input";
import Scrollbars from "react-custom-scrollbars-2";
import { useModal } from "../../hooks/ModalContext";
import { useClient } from "../../hooks/ClientContext";

const Explore: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const scrollRef = useRef<Scrollbars>(null);
  const collapsedTitleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [view, setView] = useState<"grid" | "list">();
  const [results, setResults] = useState<Array<ChatPreview | UserPreview>>([]);
  const [scrollVisible, setScrollVisible] = useState<boolean>(false);

  const handleChange = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    client.search({ text: event.target.value, checkChat: true, checkUser: true, checkName: true, checkTag: true, checkUuid: false }).then(setResults).catch(client.error);
  }, 250);

  useEffect(() => {
    let rendered: boolean = true;

    if (window.innerWidth <= 900) setView("list");
    else setView("grid");

    if (client) {
      const options: SearchOptions = { text: text, checkChat: true, checkUser: true };
      client
        .search(options)
        .catch(client.error)
        .then((results: Array<ChatPreview | UserPreview>) => {
          if (rendered) setResults(results);
        });
    }

    return () => {
      rendered = false;
    };
  }, []);

  const handleScrollVisibility = () => {
    if (!scrollRef.current) return;
    const clientHeight: number = scrollRef.current.getClientHeight();
    const scrollHeight: number = scrollRef.current.getScrollHeight();
    setScrollVisible(scrollHeight > clientHeight);
  };

  useEffect(() => {
    handleScrollVisibility();
  }, [results, scrollRef.current]);

  const title: string = "Search Chat";
  const subtitle: string = "Join and find new Chats";

  return (
    <main className={style["container"]}>
      <Scrollbar withPadding={false} withMargin={false} reference={scrollRef}>
        <section className={style["title-container"]} style={{ marginRight: scrollVisible && "0px" }} ref={containerRef}>
          <div className={style["title-content"]}>
            <h3 className={style["title"]} children={title} />
            <h5 className={style["subtitle"]} children={subtitle} />
            <div className={style["searchbar"]}>
              <Searchbar
                placeholder={"Search user or chats"}
                value={text}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  setText(event.target.value);
                  handleChange(event);
                }}
              />
            </div>
          </div>
        </section>
        <div className={style["icons"]} style={{ marginRight: scrollVisible && "0px" }}>
          <IconContainer selected={view} onChange={setView} />
        </div>

        <section className={style["content-container"]} style={{ marginRight: scrollVisible && "0px" }} data-view={view}>
          {results.map((value, index) => {
            if (typeof (value as any).size === "number") return <ChatItem view={view} chat={value as any} key={`${value.uuid}${index}`} />;
            else return <UserItem view={view} user={value as any} key={`${value.uuid}${index}`} />;
          })}
        </section>
      </Scrollbar>
    </main>
  );
};

interface UserItemProps {
  user: UserPreview;
  view: "list" | "grid";
}

const UserItem: React.FC<UserItemProps> = ({ user, view }): JSX.Element => {
  const { openUser } = useModal();
  if (view === "grid") {
    return (
      <div className={style["grid-item"]} onClick={() => openUser(user)}>
        <div className={style["content"]} style={{ background: `linear-gradient(176deg, ${user.color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} src={user.avatarURL} style={{ backgroundColor: !user.avatarURL && user.color }} />
          <div className={style["text-container"]}>
            <div className={style["name"]}>
              <h4 children={user.name} />
            </div>
            <div className={style["tag"]}>
              <code className={style["at"]} children={"#"} />
              <code children={`${user.tag}`} />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (view === "list") {
    return (
      <div className={style["list-item"]} onClick={() => openUser(user)}>
        <Avatar className={style["avatar"]} src={user.avatarURL} style={{ backgroundColor: !user.avatarURL && user.color }} />
        <div className={style["title"]}>
          <h6 children={user.name} />
        </div>
        <div children={user.tag} className={style["description"]} />
      </div>
    );
  }
};

interface ChatItemProps {
  chat: ChatPreview;
  view: "list" | "grid";
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, view }): JSX.Element => {
  const { openChatPreview } = useModal();
  if (view === "grid") {
    return (
      <div className={style["grid-item"]} onClick={() => openChatPreview(chat)}>
        <div className={style["content"]} style={{ background: `linear-gradient(176deg, ${chat.color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} src={chat.avatarURL} style={{ backgroundColor: !chat.avatarURL && chat.color }} />
          <div className={style["text-container"]}>
            <div className={style["name"]}>
              <h4 children={chat.name} />
              <GroupIcon className={style["icon"]} />
            </div>
            <div className={style["tag"]}>
              <code className={style["at"]} children={"#"} />
              <code children={`${chat.tag}`} />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (view === "list") {
    return (
      <div className={style["list-item"]} onClick={() => openChatPreview(chat)}>
        <Avatar className={style["avatar"]} src={chat.avatarURL} style={{ backgroundColor: !chat.avatarURL && chat.color }} />
        <div className={style["title"]}>
          <h6 children={chat.name} />
          <GroupIcon className={style["icon"]} />
        </div>
        <div children={chat.tag} className={style["description"]} />
      </div>
    );
  }
};

interface IconContainerProps {
  selected: "grid" | "list";
  onChange: (selected: "grid" | "list") => void;
}

const IconContainer: React.FC<IconContainerProps> = ({ onChange, selected }): JSX.Element => {
  return (
    <div className={style["icon-container"]}>
      <ToggleButtonGroup
        value={selected}
        exclusive
        size={"small"}
        onChange={(event: React.MouseEvent<HTMLElement>, value: string) => {
          value && onChange(value as any);
        }}
      >
        <ToggleButton value={"list"} children={<ViewListIcon className={style["icon"]} />} />
        <ToggleButton value={"grid"} children={<ViewModuleIcon className={style["icon"]} />} />
      </ToggleButtonGroup>
    </div>
  );
};

/**
 * Function to make a debounced input
 *
 * @param handler handler function
 *
 * @param delay delay since last action
 *
 * @returns Function
 */

let timeout: NodeJS.Timeout;

export const debounce = (handler: any, delay: number) => {
  return function (...args: Array<any>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      handler.apply(context, args);
    }, delay);
  };
};

export default Explore;

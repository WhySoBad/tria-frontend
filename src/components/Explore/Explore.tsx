import React, { useEffect, useRef, useState } from "react";
import { ChatPreview, ChatType } from "../../../../client/dist/src";
import { Avatar, useMediaQuery } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ViewList as ViewListIcon, ViewModule as ViewModuleIcon, Group as GroupIcon } from "@material-ui/icons";
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

interface ExploreProps {}

const Explore: React.FC<ExploreProps> = ({}): JSX.Element => {
  const matches = useMediaQuery("(min-width:900px)");
  const scrollRef = useRef<Scrollbars>(null);
  const collapsedTitleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsedVisible, setCollapsedVisible] = useState<boolean>(false);
  const [containerVisible, setContainerVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [view, setView] = useState<"grid" | "list">(matches ? "grid" : "list");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {};

  useEffect(() => {
    const collapsedObserver = new IntersectionObserver(([entry]) => setCollapsedVisible(entry.isIntersecting));
    const containerObserver = new IntersectionObserver(([entry]) => setContainerVisible(entry.isIntersecting));
    collapsedObserver.observe(collapsedTitleRef.current);
    containerObserver.observe(containerRef.current);
  }, []);

  const title: string = "Search Chat";
  const subtitle: string = "Join and find new Chats";

  return (
    <main className={style["container"]}>
      <div className={style["collapsed-title-container"]} ref={collapsedTitleRef} style={{ zIndex: collapsedVisible ? -1 : 10, opacity: collapsedVisible ? 0 : 1 }}>
        <h3 className={style["collapsed-title"]} style={{ opacity: containerVisible ? 0 : 1 }} children={title} />
        <div className={style["collapsed-searchbar"]} style={{ opacity: containerVisible ? 0 : 1 }}>
          <Searchbar
            value={text}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              setText(event.target.value);
              debounce(handleChange(event), 500);
            }}
          />
        </div>
        <IconContainer selected={view} onChange={setView} />
      </div>

      <Scrollbar
        reference={scrollRef}
        onScroll={() => {
          const effHeight: number = containerRef.current.offsetHeight - collapsedTitleRef.current.offsetHeight;
          if (scrollRef.current.getScrollTop() > effHeight && collapsedVisible) {
            setCollapsedVisible(false);
          } else if (scrollRef.current.getScrollTop() < effHeight && !collapsedVisible) {
            setCollapsedVisible(true);
          }
        }}
      >
        <div className={style["title-container"]} ref={containerRef}>
          <div className={style["title-content"]}>
            <h3 className={style["title"]} children={title} />
            <h5 className={style["subtitle"]} children={subtitle} />
            <div className={style["searchbar"]}>
              <Searchbar
                value={text}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  setText(event.target.value);
                  debounce(handleChange(event), 500);
                }}
              />
            </div>
          </div>
        </div>
        <div className={style["icons"]}>
          <IconContainer selected={view} onChange={setView} />
        </div>

        <section className={style["content-container"]} data-view={view}>
          {items.map((value, index) => (
            <Item view={view} chat={value} key={index} />
          ))}
        </section>
      </Scrollbar>
    </main>
  );
};

interface ItemProps {
  chat: ChatPreview;
  view: "list" | "grid";
}

const Item: React.FC<ItemProps> = ({ chat, view }): JSX.Element => {
  const { openChatPreview } = useModal();
  if (view === "grid") {
    return (
      <div className={style["grid-item"]} onClick={() => openChatPreview(chat)}>
        <div className={style["content"]} style={{ background: `linear-gradient(176deg, ${chat.color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} style={{ backgroundColor: chat.color }} />
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
        <Avatar className={style["avatar"]} style={{ backgroundColor: chat.color }} />
        <div className={style["title"]}>
          <h6 children={chat.name} />
          <GroupIcon className={style["icon"]} />
        </div>
        <div children={chat.description} className={style["description"]} />
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

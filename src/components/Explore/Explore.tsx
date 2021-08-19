import { Avatar } from "@material-ui/core";
import { Group as GroupIcon, ViewList as ViewListIcon, ViewModule as ViewModuleIcon } from "@material-ui/icons";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ChatPreview, SearchOptions, UserPreview } from "client";
import { usePalette } from "color-thief-react";
import React, { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import { useModal } from "../../hooks/ModalContext";
import style from "../../styles/modules/Explore.module.scss";
import { debounce, hexToHsl } from "../../util";
import { Searchbar } from "../Input/Input";
import Menu, { CheckboxMenuItem } from "../Menu/Menu";
import Scrollbar from "../Scrollbar/Scrollbar";

const Explore: React.FC = (): JSX.Element => {
  const { client } = useClient();
  const { translation } = useLang();
  const scrollRef = useRef<Scrollbars>(null);
  const [view, setView] = useState<"grid" | "list">();
  const [results, setResults] = useState<Array<ChatPreview | UserPreview>>([]);
  const [tuneElement, setTuneElement] = useState<null | HTMLElement>(null);
  const [options, setOptions] = useState<SearchOptions>({ text: "", checkChat: true, checkUser: true, checkName: true });

  const handleChange = debounce((text: string) => {
    client
      .search({ ...options, text: text })
      .then(setResults)
      .catch(client.error);
  }, 250);

  useEffect(() => {
    if (window.innerWidth <= 900) setView("list");
    else setView("grid");
  }, []);

  const handleOptions = (props: SearchOptions) => {
    const { checkChat, checkUser, checkName, checkUuid, checkTag } = props;
    if (!checkChat && !checkUser) {
      if (options.checkChat) setOptions({ ...props, checkUser: true });
      else setOptions({ ...props, checkChat: true });
    } else if (!checkName && !checkUuid && !checkTag) {
      if (options.checkName) setOptions({ ...props, checkTag: true });
      else setOptions({ ...props, checkName: true });
    } else setOptions(props);
  };

  useEffect(() => {
    if (!client) return;
    handleChange(options.text);
  }, [options]);

  return (
    <main className={style["container"]}>
      <Scrollbar reference={scrollRef}>
        <section className={style["title-container"]}>
          <div className={style["title-content"]}>
            <h3 className={style["title"]} children={translation.app.explore.title} />
            <div className={style["searchbar"]}>
              <Searchbar
                onTuneOpen={(event) => setTuneElement(event.currentTarget)}
                placeholder={translation.app.explore.search}
                value={options.text}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                  setOptions({ ...options, text: event.target.value });
                }}
              />
            </div>
          </div>
        </section>
        <div className={style["icons"]}>
          <IconContainer selected={view} onChange={setView} />
        </div>

        <section className={style["content-container"]} data-view={view}>
          {results.map((value, index) => {
            if (typeof (value as any).size === "number") return <ChatItem view={view} chat={value as any} key={`${value.uuid}${index}`} />;
            else return <UserItem view={view} user={value as any} key={`${value.uuid}${index}`} />;
          })}
        </section>
      </Scrollbar>
      <Menu anchorEl={tuneElement} open={Boolean(tuneElement)} onClose={() => setTuneElement(null)}>
        <CheckboxMenuItem children={translation.app.explore.filters.user} checked={options.checkUser} onCheck={(checked: boolean) => handleOptions({ ...options, checkUser: checked })} />
        <CheckboxMenuItem children={translation.app.explore.filters.chats} checked={options.checkChat} onCheck={(checked: boolean) => handleOptions({ ...options, checkChat: checked })} />
        <CheckboxMenuItem children={translation.app.explore.filters.name} checked={options.checkName} onCheck={(checked: boolean) => handleOptions({ ...options, checkName: checked })} />
        <CheckboxMenuItem children={translation.app.explore.filters.tag} checked={options.checkTag} onCheck={(checked: boolean) => handleOptions({ ...options, checkTag: checked })} />
        <CheckboxMenuItem children={translation.app.explore.filters.uuid} checked={options.checkUuid} onCheck={(checked: boolean) => handleOptions({ ...options, checkUuid: checked })} />
      </Menu>
    </main>
  );
};

interface UserItemProps {
  user: UserPreview;
  view: "list" | "grid";
}

const UserItem: React.FC<UserItemProps> = ({ user, view }): JSX.Element => {
  const [color, setColor] = useState<string>();

  const { data, loading, error } = usePalette(user.avatarURL, 3, "hex", { quality: 15, crossOrigin: "anonymous" });

  useEffect(() => {
    if (error) setColor(user.color);
    else {
      if (Array.isArray(data)) {
        const hsl: { h: number; s: number; l: number } = hexToHsl(data[0]);
        if (hsl.l < 20 && hsl.s !== 0) setColor(data[2]);
        else if (hsl.s === 0 && hsl.l < 30) setColor("#333333");
        else setColor(data[0]);
      } else setColor(data);
    }
  }, [loading, error]);

  const { openUser } = useModal();
  if (view === "grid") {
    return (
      <div className={style["grid-item"]} onClick={() => openUser(user)}>
        <div className={style["content"]} style={{ background: `linear-gradient(176deg, ${color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} src={user.avatarURL} style={{ backgroundColor: !user.avatarURL && user.color }} />
          <div className={style["text-container"]}>
            <div className={style["name"]}>
              <h4 children={user.name} />
            </div>
            <code children={`@${user.tag}`} />
          </div>
        </div>
      </div>
    );
  } else if (view === "list") {
    return (
      <div className={style["list-item"]} onClick={() => openUser(user)}>
        <Avatar className={style["avatar"]} src={user.avatarURL} style={{ backgroundColor: !user.avatarURL ? user.color : color }} />
        <div className={style["title"]}>
          <h6 children={user.name} />
        </div>
        <code children={`@${user.tag}`} className={style["tag"]} />
      </div>
    );
  }
};

interface ChatItemProps {
  chat: ChatPreview;
  view: "list" | "grid";
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, view }): JSX.Element => {
  const [color, setColor] = useState<string>();

  const { data, loading, error } = usePalette(chat.avatarURL, 3, "hex", { quality: 15, crossOrigin: "anonymous" });

  useEffect(() => {
    if (error) setColor(chat.color);
    else {
      if (Array.isArray(data)) {
        const hsl: { h: number; s: number; l: number } = hexToHsl(data[0]);
        if (hsl.l < 20 && hsl.s !== 0) setColor(data[2]);
        else if (hsl.s === 0 && hsl.l < 30) setColor("#333333");
        else setColor(data[0]);
      } else setColor(data);
    }
  }, [loading, error]);

  const { openChatPreview } = useModal();
  if (view === "grid") {
    return (
      <div className={style["grid-item"]} onClick={() => openChatPreview(chat)}>
        <div className={style["content"]} style={{ background: `linear-gradient(176deg, ${color} 29%, rgba(0,0,0,0.3) 100%)` }}>
          <div className={style["background"]} />
          <Avatar variant={"rounded"} className={style["avatar"]} src={chat.avatarURL} style={{ backgroundColor: !chat.avatarURL && chat.color }} />
          <div className={style["text-container"]}>
            <div className={style["name"]}>
              <h4 children={chat.name} />
              <GroupIcon className={style["icon"]} />
            </div>
            <code children={`@${chat.tag}`} />
          </div>
        </div>
      </div>
    );
  } else if (view === "list") {
    return (
      <div className={style["list-item"]} onClick={() => openChatPreview(chat)}>
        <Avatar className={style["avatar"]} src={chat.avatarURL} style={{ backgroundColor: !chat.avatarURL ? chat.color : color }} />
        <div className={style["title"]}>
          <h6 children={chat.name} />
          <GroupIcon className={style["icon"]} />
        </div>
        <code children={`@${chat.tag}`} className={style["tag"]} />
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
        <ToggleButton disableRipple value={"list"} children={<ViewListIcon className={style["icon"]} />} />
        <ToggleButton disableRipple value={"grid"} children={<ViewModuleIcon className={style["icon"]} />} />
      </ToggleButtonGroup>
    </div>
  );
};

export default Explore;

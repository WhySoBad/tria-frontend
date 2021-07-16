import React from "react";
import { BannedMember, Chat, ChatSocketEvent, checkGroupTag, Group, Locale, Member, PrivateChat } from "client";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Profile.module.scss";
import { useChat } from "../../hooks/ChatContext";
import { Avatar, FormControlLabel, IconButton } from "@material-ui/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button, { TextButton } from "../Button/Button";
import Input, { Checkbox, Searchbar, Select } from "../Input/Input";
import { debouncedPromise } from "../../util";
import { useState } from "react";
import baseStyle from "../../styles/modules/Modal.module.scss";
import { ArrowDropDown as ArrowDownIcon, ArrowDropUp as ArrowUpIcon, Group as GroupIcon } from "@material-ui/icons";
import { useEffect } from "react";
import Scrollbar from "../Scrollbar/Scrollbar";
import { useRouter } from "next/router";
import Snackbar from "../Snackbar/Snackbar";
import { Alert } from "@material-ui/lab";
import { useModal } from "../../hooks/ModalContext";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = (): JSX.Element => {
  const { client } = useClient();
  const { selected } = useChat();

  return (
    <>
      <div className={style["title-container"]}>
        <title children={"Profile"} />
        <h3 className={style["title"]} children={"Profile"} />
      </div>
      <Scrollbar>
        <section className={style["user-settings-container"]}>
          <Settings />
          <ChatsList />
          <BannedMemberList />
        </section>
      </Scrollbar>
    </>
  );
};

interface ChatsListProps {}

const ChatsList: React.FC<ChatsListProps> = ({}): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { client } = useClient();
  const [, setUpdate] = useState<number>(0);

  const handleUpdate = () => setUpdate(new Date().getTime());

  useEffect(() => {
    client.on(ChatSocketEvent.CHAT_DELETE, handleUpdate);
    client.on(ChatSocketEvent.GROUP_CREATE, handleUpdate);
    client.on(ChatSocketEvent.PRIVATE_CREATE, handleUpdate);
    return () => {
      client.off(ChatSocketEvent.CHAT_DELETE, handleUpdate);
      client.off(ChatSocketEvent.GROUP_CREATE, handleUpdate);
      client.off(ChatSocketEvent.PRIVATE_CREATE, handleUpdate);
    };
  }, []);

  return (
    <div className={style["chats-container"]}>
      <h5 className={style["title"]}>Chats</h5>
      <div className={style["searchbar"]} children={<Searchbar withMinWidth={false} onChange={({ target: { value } }) => setText(value)} withTune={false} placeholder={"Search member"} />} />
      <div className={style["list-container"]}>
        <Scrollbar withPadding={false}>
          {client.user.chats
            .values()
            .filter((chat: Chat) => {
              const name: string = chat instanceof PrivateChat ? chat.participant.user.name : chat instanceof Group ? chat.name : "";
              return name.toLowerCase().startsWith(text.toLowerCase());
            })
            .map((chat: Chat) => (
              <ChatsListItem chat={chat} key={chat.uuid} />
            ))}
        </Scrollbar>
      </div>
    </div>
  );
};

interface ChatsListItemProps {
  chat: Chat;
}

const ChatsListItem: React.FC<ChatsListItemProps> = ({ chat }): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [snackError, setSnackError] = useState<string>();
  const { openChat } = useModal();

  const name: string = chat instanceof PrivateChat ? chat.participant.user.name : chat instanceof Group ? chat.name : "";
  const avatarURL: string | null = chat instanceof PrivateChat ? chat.participant.user.avatarURL : chat instanceof Group ? chat.avatarURL : null;
  const color: string = chat instanceof PrivateChat ? chat.participant.user.color : chat instanceof Group ? chat.color : "";
  const description: string = chat instanceof PrivateChat ? chat.participant.user.description : chat instanceof Group ? chat.description : "";

  return (
    <div className={style["item-container"]} onClick={() => openChat(chat)}>
      <div className={style["item"]}>
        <Avatar className={style["avatar"]} src={avatarURL} style={{ backgroundColor: !avatarURL && color }} />
        <div className={style["title"]}>
          <h6 children={name} />
          {chat instanceof Group && <GroupIcon className={style["icon"]} />}
        </div>
        <div children={description} className={style["description"]} />
        <div className={style["options-container"]} data-collapsed={collapsed} onClick={(event) => event.stopPropagation()}></div>
      </div>
      <div className={style["icon-container"]}>
        <IconButton
          className={baseStyle["iconbutton"]}
          onClick={() => setCollapsed(!collapsed)}
          children={collapsed ? <ArrowDownIcon className={baseStyle["icon"]} /> : <ArrowUpIcon className={baseStyle["icon"]} />}
        />
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

interface SettingsProps {
  disabled?: boolean;
}

type Inputs = {
  name: string;
  tag: string;
  description: string;
  locale: Locale;
};

const Settings: React.FC<SettingsProps> = ({ disabled = false }): JSX.Element => {
  const { client } = useClient();
  const [defaultLocale, setDefaultLocale] = useState<Locale>();
  const [snackError, setSnackError] = useState<string>();
  const [url, setUrl] = useState<string>(client.user.avatarURL);
  const [defaultAvatar, setDefaultAvatar] = useState<boolean>(!!client.user.avatarURL);
  const [avatar, setAvatar] = useState<File>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<Inputs>({
    defaultValues: {
      description: client.user.description,
      locale: client.user.locale,
      name: client.user.name,
      tag: client.user.tag,
    },
    mode: "onChange",
  });

  const resetForm = () => {
    reset({
      description: client.user.description,
      locale: client.user.locale,
      name: client.user.name,
      tag: client.user.tag,
    });
  };

  useEffect(() => {
    const lang: string = navigator.language.length > 2 ? navigator.language.split("-")[1] : navigator.language;
    setDefaultLocale(lang === "DE" ? "DE" : lang === "FR" ? "FR" : "EN");
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const changes: Map<string, string | Locale> = new Map<string, string | Locale>();
    Object.keys(dirtyFields).forEach((key: string) => changes.set(key, data[key]));
    console.log(changes, defaultAvatar, avatar, url);
    if (changes.size !== 0) client.user.setSettings(Object.fromEntries(changes)).then(resetForm).catch(setSnackError);
    if (defaultAvatar && !avatar && !url)
      client.user
        .deleteAvatar()
        .then(() => {
          resetForm();
          setDefaultAvatar(false);
        })
        .catch(setSnackError);
    if (avatar) {
      const formData: FormData = new FormData();
      formData.append("avatar", avatar, `${client.user.uuid}.jpg`);
      client.user
        .setAvatar(formData)
        .then(() => {
          resetForm();
          setDefaultAvatar(true);
          setAvatar(null);
        })
        .catch(setSnackError);
    }
  };

  const isValidTag = debouncedPromise(async (tag: string): Promise<boolean> => {
    if (tag === client.user.tag) return true;
    const exists: boolean = await checkGroupTag(tag);
    return !exists;
  }, 250);

  const handleDelete = () => {};

  return (
    <div className={style["settings-container"]}>
      <h5 className={style["title"]}>Settings</h5>
      <div className={style["avatar-container"]}>
        <label htmlFor={"upload-avatar"}>
          <a>
            <Avatar aria-disabled={disabled} className={style["avatar"]} src={url} style={{ backgroundColor: !url && client.user.color }} />
          </a>
        </label>
        <input
          id={"upload-avatar"}
          type={"file"}
          style={{ display: "none" }}
          accept={".jpg"}
          disabled={disabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files !== null) {
              const file: File = event.target.files.item(0);
              if (!file) return;
              const isJPEG: boolean = file.type === "image/jpeg";
              const isFitting: boolean = file.size <= 100000;
              const url: string = URL.createObjectURL(file);
              if (isJPEG && isFitting) {
                setAvatar(file);
                setUrl(url);
              } else if (!isFitting) setSnackError("Maxiumum Avatar Size Is 100'000 Bytes");
            }
          }}
        />
        <div className={style["delete"]}>
          <TextButton
            disabled={disabled}
            children={"Delete avatar"}
            onClick={() => {
              setUrl(null);
              setAvatar(null);
            }}
          />
        </div>
      </div>
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={"name"}
            control={control}
            defaultValue={client.user.name}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disabled} placeholder={"Name"} className={style["name"]} {...field} error={!!errors.name} />}
          />
          <Controller
            name={"tag"}
            control={control}
            defaultValue={client.user.tag}
            rules={{ validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true }}
            render={({ field }) => (
              <Input
                disabled={disabled}
                placeholder={"Tag"}
                className={style["tag"]}
                onKeyDown={(event) => event.key.length === 1 && !event.key.match(/[A-Za-z0-9]/) && event.preventDefault()}
                {...field}
                error={!!errors.tag}
              />
            )}
          />
          <Controller
            name={"description"}
            control={control}
            defaultValue={client.user.description}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disabled} placeholder={"Description"} className={style["description"]} {...field} error={!!errors.description} />}
          />
          <div
            className={style["locale"]}
            children={
              <Controller
                name={"locale"}
                control={control}
                defaultValue={defaultLocale}
                render={({ field: { onChange, ...rest } }) => (
                  <Select
                    onChange={(event) => onChange && onChange((event as any).value)}
                    values={[
                      { value: "EN", label: "English" },
                      { value: "DE", label: "German" },
                      { value: "FR", label: "French" },
                    ]}
                    {...rest}
                  />
                )}
              />
            }
          />

          <div className={style["button-container"]}>
            <div className={style["button"]} children={<Button children={"Delete"} onClick={handleDelete} />} />
            <div
              className={style["button"]}
              children={<Button children={"Save"} type={"submit"} disabled={disabled || !(isValid && (isDirty || avatar || (client.user.avatarURL && !avatar && !url)))} />}
            />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

interface BannedMemberListProps {}

const BannedMemberList: React.FC<BannedMemberListProps> = ({}): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { client } = useClient();
  const [, setUpdate] = useState<number>(0);

  return (
    <div className={style["banned-container"]}>
      <h5 className={style["title"]}>Banned Members</h5>
      <div className={style["searchbar"]} children={<Searchbar withMinWidth={false} onChange={({ target: { value } }) => setText(value)} withTune={false} placeholder={"Search member"} />} />
      <div className={style["list-container"]}>
        <Scrollbar withPadding={false}>
          {/*  {chat.bannedMembers
            .values()
            .filter(({ name }) => name.toLowerCase().startsWith(text.toLowerCase()))
            .map((member: BannedMember) => {
              return <BannedListItem member={member} chat={chat} key={member.uuid} />;
            })} */}
        </Scrollbar>
      </div>
    </div>
  );
};

interface BannedListItemProps {
  member: BannedMember;
}

const BannedListItem: React.FC<BannedListItemProps> = ({ member }): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [snackError, setSnackError] = useState<string>();
  const { client } = useClient();

  return (
    <div className={style["item-container"]} onClick={() => setCollapsed(!collapsed)}>
      <div className={style["item"]}>
        <Avatar className={style["avatar"]} src={member.avatarURL || ""} style={{ backgroundColor: !member.avatarURL && member.color }} />
        <h6 children={member.name} className={style["title"]} />
        <div children={member.description} className={style["description"]} />
        <div className={style["options-container"]} data-collapsed={collapsed} onClick={(event) => event.stopPropagation()}></div>
      </div>
      <div className={style["icon-container"]}>
        <IconButton
          className={baseStyle["iconbutton"]}
          onClick={() => setCollapsed(!collapsed)}
          children={collapsed ? <ArrowDownIcon className={baseStyle["icon"]} /> : <ArrowUpIcon className={baseStyle["icon"]} />}
        />
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

export default Profile;

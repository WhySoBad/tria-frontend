import { Avatar } from "@material-ui/core";
import { Group as GroupIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { Chat, ChatSocketEvent, checkGroupTag, Group, Locale, PrivateChat } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import { useModal } from "../../hooks/ModalContext";
import style from "../../styles/modules/Profile.module.scss";
import { debouncedPromise } from "../../util";
import Button, { TextButton } from "../Button/Button";
import Input, { Searchbar, Select } from "../Input/Input";
import Scrollbar from "../Scrollbar/Scrollbar";
import Snackbar from "../Snackbar/Snackbar";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = (): JSX.Element => {
  const { translation } = useLang();
  const { client } = useClient();
  return (
    <>
      <title children={`${translation.sites.profile} ${client.user.name}`} />
      <div className={style["title-container"]}>
        <h3 className={style["title"]} children={translation.app.profile.title} />
      </div>
      <Scrollbar>
        <section className={style["user-profile-container"]}>
          <Settings />
          <ChatsList />
        </section>
      </Scrollbar>
    </>
  );
};

const ChatsList: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { client } = useClient();
  const { translation } = useLang();
  const [, setUpdate] = useState<number>(0);

  const handleUpdate = () => setUpdate(Date.now());

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
      <h5 className={style["title"]} children={translation.app.profile.chats.title} />
      <div
        className={style["searchbar"]}
        children={<Searchbar withMinWidth={false} onChange={({ target: { value } }) => setText(value)} withTune={false} placeholder={translation.app.profile.chats.search_chat} />}
      />
      <div className={style["list-container"]}>
        <Scrollbar>
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
  const [snackError, setSnackError] = useState<string>();
  const { openChat } = useModal();

  const name: string = chat instanceof PrivateChat ? chat.participant.user.name : chat instanceof Group ? chat.name : "";
  const avatarURL: string | null = chat instanceof PrivateChat ? chat.participant.user.avatarURL : chat instanceof Group ? chat.avatarURL : null;
  const color: string = chat instanceof PrivateChat ? chat.participant.user.color : chat instanceof Group ? chat.color : "";
  const tag: string = chat instanceof PrivateChat ? chat.participant.user.tag : chat instanceof Group ? chat.tag : "";

  return (
    <div className={style["item-container"]} onClick={() => openChat(chat)}>
      <div className={style["item"]}>
        <Avatar className={style["avatar"]} src={avatarURL} style={{ backgroundColor: !avatarURL && color }} />
        <div className={style["title"]}>
          <h6 children={name} />
          {chat instanceof Group && <GroupIcon className={style["icon"]} />}
        </div>
        <div children={`@${tag}`} className={style["tag"]} />
        <div className={style["options-container"]} onClick={(event) => event.stopPropagation()}></div>
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
  const { translation, setLanguage } = useLang();
  const { openPasswordChange } = useModal();
  const [defaultLocale, setDefaultLocale] = useState<Locale>();
  const [snackError, setSnackError] = useState<string>();
  const [url, setUrl] = useState<string>(client.user.avatarURL);
  const [defaultAvatar, setDefaultAvatar] = useState<boolean>(!!client.user.avatarURL);
  const [avatar, setAvatar] = useState<File>(null);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields, isSubmitting },
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
    setLanguage(client.user.locale);
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

  const handleDelete = () => {
    client
      .delete()
      .then(() => router.push("/"))
      .catch(setSnackError);
  };

  return (
    <div className={style["settings-container"]}>
      <h5 className={style["title"]} children={translation.app.profile.settings.title} />
      <div className={style["avatar-container"]}>
        <label htmlFor={"upload-avatar"}>
          <a>
            <Avatar
              aria-disabled={disabled || isSubmitting}
              data-content={translation.app.profile.settings.upload_avatar}
              className={style["avatar"]}
              src={url}
              style={{ backgroundColor: !url && client.user.color }}
            />
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
            children={translation.app.profile.settings.delete_avatar}
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
            render={({ field }) => <Input disabled={disabled} placeholder={translation.app.profile.settings.name} className={style["name"]} {...field} error={!!errors.name} />}
          />
          <Controller
            name={"tag"}
            control={control}
            defaultValue={client.user.tag}
            rules={{ validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true }}
            render={({ field }) => (
              <Input
                disabled={disabled}
                placeholder={translation.app.profile.settings.tag}
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
            render={({ field }) => <Input disabled={disabled} placeholder={translation.app.profile.settings.description} className={style["description"]} {...field} error={!!errors.description} />}
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
                    onChange={(event) => onChange && onChange(event.target.value)}
                    values={[
                      { value: "EN", label: translation.locales.EN },
                      { value: "DE", label: translation.locales.DE },
                      { value: "FR", label: translation.locales.FR, disabled: true },
                    ]}
                    {...rest}
                  />
                )}
              />
            }
          />
          <div className={style["button-container"]}>
            <div className={style["change-password"]} children={<TextButton children={translation.app.profile.settings.change_password} onClick={() => openPasswordChange()} />} />
            <div className={style["button"]} children={<Button children={translation.app.profile.settings.delete} onClick={handleDelete} />} />
            <div
              className={style["button"]}
              children={
                <Button
                  children={translation.app.profile.settings.save}
                  type={"submit"}
                  disabled={disabled || isSubmitting || url === client.user.avatarURL || !(isValid && (isDirty || avatar || (client.user.avatarURL && !avatar && !url)))}
                />
              }
            />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

export default Profile;

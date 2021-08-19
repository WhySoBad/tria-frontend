import { Avatar, FormControlLabel, IconButton } from "@material-ui/core";
import { ArrowDropDown as ArrowDownIcon, ArrowDropUp as ArrowUpIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { Admin, BannedMember, checkGroupTag, ClientEvent, Group, GroupRole, GroupType, Member, Owner, Permission } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Chat.module.scss";
import baseStyle from "../../styles/modules/Modal.module.scss";
import { debouncedPromise } from "../../util";
import Button, { TextButton } from "../Button/Button";
import Input, { Checkbox, Searchbar, Select } from "../Input/Input";
import Scrollbar from "../Scrollbar/Scrollbar";
import Snackbar from "../Snackbar/Snackbar";
import ChatTitle from "./ChatTitle";

interface ChatSettingsProps {
  chat: Group;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ chat }): JSX.Element => {
  return (
    <>
      <div className={style["title-container"]} children={<ChatTitle settings />} />
      <Scrollbar>
        <section className={style["chat-settings-container"]}>
          <Settings chat={chat} />
          <MemberList chat={chat} />
          <BannedMemberList chat={chat} />
        </section>
      </Scrollbar>
    </>
  );
};

interface MemberListProps {
  chat: Group;
}

const MemberList: React.FC<MemberListProps> = ({ chat }): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { client } = useClient();
  const { translation } = useLang();
  const [, setUpdate] = useState<number>(0);

  const handleUpdate = (chatUuid: string) => chatUuid === chat.uuid && setUpdate(Date.now());

  useEffect(() => {
    client.on(ClientEvent.MEMBER_JOIN, handleUpdate);
    client.on(ClientEvent.MEMBER_LEAVE, handleUpdate);
    client.on(ClientEvent.MEMBER_BAN, handleUpdate);
    return () => {
      client.off(ClientEvent.MEMBER_JOIN, handleUpdate);
      client.off(ClientEvent.MEMBER_LEAVE, handleUpdate);
      client.off(ClientEvent.MEMBER_BAN, handleUpdate);
    };
  }, []);

  const user: Member = chat.members.get(client.user.uuid);

  return (
    <div className={style["member-container"]}>
      <h5 className={style["title"]} children={translation.app.chat_settings.member.title} />
      <div
        className={style["searchbar"]}
        children={<Searchbar withMinWidth={false} onChange={({ target: { value } }) => setText(value)} withTune={false} placeholder={translation.app.chat_settings.member.search_member} />}
      />
      <div className={style["list-container"]}>
        <Scrollbar>
          {chat.members
            .values()
            .filter(({ user: { name } }) => name.toLowerCase().startsWith(text.toLowerCase()))
            .map((member: Member) => {
              return <MemberListItem uuid={member.user.uuid} user={user} chat={chat} key={member.user.uuid} />;
            })}
        </Scrollbar>
      </div>
    </div>
  );
};

interface MemberListItemProps {
  uuid: string;
  user: Member;
  chat: Group;
}

type MemberItemInputs = {
  role: GroupRole;
  edit_member: boolean;
  edit_chat: boolean;
  ban: boolean;
  unban: boolean;
  kick: boolean;
};

const MemberListItem: React.FC<MemberListItemProps> = ({ uuid, user, chat }): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [snackError, setSnackError] = useState<string>();
  const { translation } = useLang();
  const member: Member = chat.members.get(uuid);
  const [role, setRole] = useState<GroupRole>(member.role);
  const { client } = useClient();
  const admin: Admin | undefined = member instanceof Admin ? member : undefined;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { dirtyFields, isDirty, isValid },
  } = useForm<MemberItemInputs>({
    defaultValues: {
      role: member.role,
      ban: admin && admin.canBan,
      edit_chat: admin && admin.canEditGroup,
      edit_member: admin && admin.canEditMembers,
      kick: admin && admin.canKick,
      unban: admin && admin.canUnban,
    },
  });

  const resetForm = () => {
    const member: Member = chat.members.get(uuid);
    const admin: Admin | undefined = member instanceof Admin ? member : undefined;
    reset({
      role: member.role,
      ban: admin && admin.canBan,
      edit_chat: admin && admin.canEditGroup,
      edit_member: admin && admin.canEditMembers,
      kick: admin && admin.canKick,
      unban: admin && admin.canUnban,
    });
  };

  useEffect(() => {
    resetForm();
    setRole(member.role);
    setValue("role", member.role);
  }, [chat.uuid]);

  const onSubmit: SubmitHandler<MemberItemInputs> = (data: MemberItemInputs) => {
    if (chat.canEditMembers) {
      const changes: Map<string, string> = new Map<string, string>();
      Object.keys(dirtyFields).forEach((key: string) => changes.set(key, data[key]));
      const permissions: Array<Permission> = [];
      if ((changes.get("role") || member.role) === GroupRole.ADMIN) {
        if ((admin && admin.canBan && data.ban !== false) || changes.get("ban")) permissions.push(Permission.BAN);
        if ((admin && admin.canEditGroup && data.edit_chat !== false) || changes.get("edit_chat")) permissions.push(Permission.CHAT_EDIT);
        if ((admin && admin.canEditMembers && data.edit_member !== false) || changes.get("edit_member")) permissions.push(Permission.MEMBER_EDIT);
        if ((admin && admin.canKick && data.kick !== false) || changes.get("kick")) permissions.push(Permission.KICK);
        if ((admin && admin.canUnban && data.unban !== false) || changes.get("unban")) permissions.push(Permission.UNBAN);
      }
      chat
        .editMember(member, { role: (changes.get("role") as any) || member.role, permissions: permissions })
        .then(resetForm)
        .catch(setSnackError);
    }
  };

  const handleKick = () => {
    if (chat.canKick) chat.kickMember(member).catch(setSnackError);
  };

  const handleBan = () => {
    if (chat.canBan) chat.banMember(member).catch(setSnackError);
  };

  const disabled: boolean = member.user.uuid === client.user.uuid || !chat.canEditMembers || member instanceof Owner;

  return (
    <div className={style["item-container"]} onClick={() => setCollapsed(!collapsed)}>
      <div className={style["item"]}>
        <Avatar className={style["avatar"]} src={member.user.avatarURL || ""} style={{ backgroundColor: !member.user.avatarURL && member.user.color }} />
        <h6 children={member.user.name} className={style["title"]} />
        <div children={member.user.description} className={style["description"]} />
        <div className={style["options-container"]} data-collapsed={collapsed} onClick={(event) => event.stopPropagation()}>
          <div className={style["form-container"]}>
            <form className={style["form"]} onSubmit={handleSubmit(onSubmit)} data-visible={role === GroupRole.ADMIN}>
              <div className={style["role-container"]}>
                <Controller
                  name={"role"}
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <Select
                      disabled={disabled}
                      onChange={(event) => {
                        onChange(event.target.value);
                        setRole(event.target.value as GroupRole);
                      }}
                      value={value}
                      values={[
                        { value: GroupRole.MEMBER, label: translation.app.chat_settings.member.roles.member },
                        { value: GroupRole.ADMIN, label: translation.app.chat_settings.member.roles.admin },
                        (user instanceof Owner || member instanceof Owner) && { value: GroupRole.OWNER, label: translation.app.chat_settings.member.roles.owner },
                      ]}
                      {...rest}
                    />
                  )}
                />
              </div>
              <div className={style["permission-container"]}>
                <Controller
                  name={"edit_member"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={translation.app.chat_settings.member.edit_member}
                      checked={typeof field.value === "string" ? false : !!field.value}
                      onChange={(e, checked) => field.onChange(checked)}
                      classes={{ root: style["edit_member"], label: style["label"] }}
                      control={<Checkbox disabled={disabled} />}
                    />
                  )}
                />
                <Controller
                  name={"edit_chat"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={translation.app.chat_settings.member.edit_chat}
                      checked={typeof field.value === "string" ? false : !!field.value}
                      onChange={(e, checked) => field.onChange(checked)}
                      classes={{ root: style["edit_chat"], label: style["label"] }}
                      control={<Checkbox disabled={disabled} />}
                    />
                  )}
                />
                <Controller
                  name={"kick"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={translation.app.chat_settings.member.kick}
                      checked={typeof field.value === "string" ? false : !!field.value}
                      onChange={(e, checked) => field.onChange(checked)}
                      classes={{ root: style["kick"], label: style["label"] }}
                      control={<Checkbox disabled={disabled} />}
                    />
                  )}
                />
                <Controller
                  name={"ban"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={translation.app.chat_settings.member.ban}
                      checked={typeof field.value === "string" ? false : !!field.value}
                      onChange={(e, checked) => field.onChange(checked)}
                      classes={{ root: style["ban"], label: style["label"] }}
                      control={<Checkbox disabled={disabled} />}
                    />
                  )}
                />
                <Controller
                  name={"unban"}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={translation.app.chat_settings.member.unban}
                      checked={typeof field.value === "string" ? false : !!field.value}
                      onChange={(e, checked) => field.onChange(checked)}
                      classes={{ root: style["unban"], label: style["label"] }}
                      control={<Checkbox disabled={disabled} />}
                    />
                  )}
                />
              </div>
              <div className={style["button-container"]}>
                {chat.canKick && !(member instanceof Owner) && <div className={style["button"]} children={<Button children={translation.app.chat_settings.member.kick} onClick={handleKick} />} />}
                {chat.canBan && !(member instanceof Owner) && <div className={style["button"]} children={<Button children={translation.app.chat_settings.member.ban} onClick={handleBan} />} />}
                {!(member instanceof Owner) && (
                  <div className={style["button"]} children={<Button children={translation.app.chat_settings.member.save} type={"submit"} disabled={!(isValid && isDirty)} />} />
                )}
              </div>
            </form>
          </div>
        </div>
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
  chat: Group;
  disabled?: boolean;
}

type Inputs = {
  name: string;
  tag: string;
  description: string;
  isPublic: boolean;
};

const Settings: React.FC<SettingsProps> = ({ chat, disabled = false }): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const router = useRouter();
  const { translation } = useLang();
  const [url, setUrl] = useState<string>(chat.avatarURL);
  const [avatar, setAvatar] = useState<File>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      description: chat.description,
      isPublic: chat.public,
      name: chat.name,
      tag: chat.tag,
    },
    mode: "onChange",
  });

  const resetForm = () => reset({ description: chat.description, name: chat.name, isPublic: chat.public, tag: chat.tag });

  useEffect(() => {
    resetForm();
    setUrl(chat.avatarURL);
  }, [chat.uuid]);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const changes: Map<string, string> = new Map<string, string>();
    Object.keys(dirtyFields).forEach((key: string) => {
      if (key === "isPublic") changes.set("type", data[key] ? GroupType.GROUP : GroupType.PRIVATE_GROUP);
      else changes.set(key, data[key]);
    });
    if (changes.size !== 0) chat.setSettings(Object.fromEntries(changes)).then(resetForm).catch(setSnackError);
    if (avatar || (chat.avatarURL && !avatar && !url)) {
      if (!avatar) chat.deleteAvatar().then(resetForm).catch(setSnackError);
      else {
        const formData: FormData = new FormData();
        formData.append("avatar", avatar, chat.uuid + ".jpg");
        chat.setAvatar(formData).then(resetForm).catch(setSnackError);
      }
    }
  };

  const isValidTag = debouncedPromise(async (tag: string): Promise<boolean> => {
    if (tag === chat.tag) return true;
    const exists: boolean = await checkGroupTag(tag);
    return !exists;
  }, 250);

  const handleDelete = () => {
    if (!chat.canDelete) return;
    chat
      .delete()
      .then(() => router.push("/app"))
      .catch(setSnackError);
  };

  return (
    <div className={style["settings-container"]}>
      <h5 className={style["title"]} children={translation.app.chat_settings.settings.title} />
      <div className={style["avatar-container"]}>
        <label htmlFor={"upload-avatar"}>
          <a>
            <Avatar
              aria-disabled={disabled}
              data-content={translation.app.chat_settings.settings.upload_avatar}
              className={style["avatar"]}
              src={url}
              style={{ backgroundColor: !url && chat.color }}
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
            children={translation.app.chat_settings.settings.delete_avatar}
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
            defaultValue={chat.name}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disabled} placeholder={translation.app.chat_settings.settings.name} className={style["name"]} {...field} error={!!errors.name} />}
          />
          <Controller
            name={"tag"}
            control={control}
            defaultValue={chat.tag}
            rules={{ validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true }}
            render={({ field }) => (
              <Input
                disabled={disabled}
                placeholder={translation.app.chat_settings.settings.tag}
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
            defaultValue={chat.description}
            rules={{ required: true }}
            render={({ field }) => (
              <Input disabled={disabled} placeholder={translation.app.chat_settings.settings.description} className={style["description"]} {...field} error={!!errors.description} />
            )}
          />

          <Controller
            name={"isPublic"}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label={translation.app.chat_settings.settings.public}
                checked={typeof field.value === "string" ? false : !!field.value}
                onChange={(e, checked) => field.onChange(checked)}
                classes={{ root: style["public"], label: style["label"] }}
                control={<Checkbox disabled={disabled} />}
              />
            )}
          />
          <div className={style["button-container"]}>
            {chat.canDelete && <div className={style["button"]} children={<Button children={translation.app.chat_settings.settings.delete} onClick={handleDelete} />} />}
            <div
              className={style["button"]}
              children={
                <Button
                  children={translation.app.chat_settings.settings.save}
                  type={"submit"}
                  disabled={disabled || isSubmitting || (!isDirty && !((chat.avatarURL && !url) || (chat.avatarURL !== url && !!avatar)))}
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

interface BannedMemberListProps {
  chat: Group;
}

const BannedMemberList: React.FC<BannedMemberListProps> = ({ chat }): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { client } = useClient();
  const { translation } = useLang();
  const [, setUpdate] = useState<number>(0);

  const handleUpdate = (chatUuid: string) => chatUuid === chat.uuid && setUpdate(Date.now());

  useEffect(() => {
    client.on(ClientEvent.MEMBER_BAN, handleUpdate);
    client.on(ClientEvent.MEMBER_UNBAN, handleUpdate);
    return () => {
      client.off(ClientEvent.MEMBER_BAN, handleUpdate);
      client.off(ClientEvent.MEMBER_UNBAN, handleUpdate);
    };
  }, []);

  return (
    <div className={style["banned-container"]}>
      <h5 className={style["title"]} children={translation.app.chat_settings.banned_member.title} />
      <div
        className={style["searchbar"]}
        children={<Searchbar withMinWidth={false} onChange={({ target: { value } }) => setText(value)} withTune={false} placeholder={translation.app.chat_settings.banned_member.search_member} />}
      />
      <div className={style["list-container"]}>
        <Scrollbar>
          {chat.bannedMembers
            .values()
            .filter(({ name }) => name.toLowerCase().startsWith(text.toLowerCase()))
            .map((member: BannedMember) => {
              return <BannedListItem member={member} chat={chat} key={member.uuid} />;
            })}
        </Scrollbar>
      </div>
    </div>
  );
};

interface BannedListItemProps {
  member: BannedMember;
  chat: Group;
}

const BannedListItem: React.FC<BannedListItemProps> = ({ member, chat }): JSX.Element => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [snackError, setSnackError] = useState<string>();
  const { translation } = useLang();

  const handleUnban = () => {
    if (chat.canUnban) chat.unbanMember(member.uuid).catch(setSnackError);
  };

  return (
    <div className={style["item-container"]} onClick={() => setCollapsed(!collapsed)}>
      <div className={style["item"]}>
        <Avatar className={style["avatar"]} src={member.avatarURL || ""} style={{ backgroundColor: !member.avatarURL && member.color }} />
        <h6 children={member.name} className={style["title"]} />
        <div children={member.description} className={style["description"]} />
        <div className={style["options-container"]} data-collapsed={collapsed} onClick={(event) => event.stopPropagation()}>
          <div className={style["button"]} children={<Button children={translation.app.chat_settings.banned_member.unban} disabled={!chat.canUnban} onClick={handleUnban} />} />
        </div>
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

export default ChatSettings;

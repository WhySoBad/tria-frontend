import { FormControlLabel } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { checkGroupTag, GroupRole, GroupType, SearchOptions, UserPreview } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useClient, useLang } from "../hooks";
import style from "../styles/modules/Create.module.scss";
import { debounce, debouncedPromise } from "../util";
import Avatar from "./Avatar";
import Button from "./Button";
import Input, { Checkbox, Searchbar } from "./Input";
import Scrollbar from "./Scrollbar";
import Snackbar from "./Snackbar";

const Create: React.FC = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <>
      <div className={style["title-container"]}>
        <h3 className={style["title"]} children={translation.app.create.title} />
      </div>
      <Scrollbar>
        <section className={style["createchat-container"]}>
          <Settings />
        </section>
      </Scrollbar>
    </>
  );
};

interface SettingsProps {
  disabled?: boolean;
}

type Inputs = {
  name: string;
  tag: string;
  description: string;
  public: boolean;
};

const Settings: React.FC<SettingsProps> = ({ disabled = false }): JSX.Element => {
  const { client } = useClient();
  const { translation } = useLang();
  const [snackError, setSnackError] = useState<string>();
  const [text, setText] = useState<string>(""); //text to query search
  const [results, setResults] = useState<Array<UserPreview>>([]); //results of the search
  const [selected, setSelected] = useState<Array<UserPreview>>([]); //results which are selected to be part of the chat
  const [checkedTag, setCheckedTag] = useState<{ tag: string; valid: boolean }>();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, dirtyFields, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      description: "",
      name: "",
      tag: "",
    },
    mode: "onChange",
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    client
      .createGroupChat({ ...data, type: data.public ? GroupType.GROUP : GroupType.PRIVATE_GROUP, avatar: null, members: selected.map(({ uuid }) => ({ uuid: uuid, role: GroupRole.MEMBER })) })
      .then((uuid: string) => router.push(`/chat/${uuid}`))
      .catch(setSnackError);
  };

  const isValidTag = debouncedPromise(async (tag: string): Promise<boolean> => {
    if (checkedTag?.tag === tag) return checkedTag?.valid; //check whether this tag has already been checked
    const exists: boolean = await checkGroupTag(tag); //boolean whether the chat tag exists
    if (exists) setSnackError("Tag Has To Be Unique");
    setCheckedTag({ tag: tag, valid: !exists });
    return !exists;
  }, 250);

  const options: SearchOptions = { text: "", checkUser: true, checkName: true, checkTag: true }; //search options with all search parameters

  useEffect(() => {
    let rendered: boolean = true;
    if (client) {
      client
        .search({ ...options, text: text })
        .catch(client.error)
        .then((results: Array<UserPreview>) => {
          if (rendered) setResults(results);
        });
    }

    return () => {
      rendered = false;
    };
  }, []);

  const handleChange = (user: UserPreview, checked: boolean) => {
    const { uuid } = user;
    if (checked && !selected.find((user) => user.uuid === uuid)) setSelected([...selected, user]);
    if (!checked) setSelected(selected.filter(({ uuid }) => uuid !== user.uuid));
  };

  const handleSearch = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    client
      .search({ ...options, text: event.target.value })
      .then(setResults as any)
      .catch(client.error);
  }, 250);

  return (
    <div className={style["settings-container"]}>
      <h5 className={style["title"]} children={translation.app.create.informations.title} />
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={"name"}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disabled} placeholder={translation.app.create.informations.name} className={style["name"]} {...field} error={!!errors.name} />}
          />
          <Controller
            name={"tag"}
            control={control}
            rules={{ validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true }}
            render={({ field }) => (
              <Input
                disabled={disabled}
                placeholder={translation.app.create.informations.tag}
                className={style["tag"]}
                onKeyDown={(event) => event.key.length === 1 && !event.key.match(/[A-Za-z0-9]/) && event.preventDefault()}
                {...field}
                error={!!errors.tag}
              />
            )}
          />
          <Controller
            name={"public"}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label={translation.app.create.informations.public}
                checked={typeof field.value === "string" ? false : !!field.value}
                onChange={(e, checked) => field.onChange(checked)}
                classes={{ root: style["public"], label: style["label"] }}
                control={<Checkbox disabled={disabled} />}
              />
            )}
          />
          <Controller
            name={"description"}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disabled} placeholder={translation.app.create.informations.description} className={style["description"]} {...field} error={!!errors.description} />}
          />
          <div className={style["members-container"]}>
            <h5 className={style["title"]} children={translation.app.create.members.title} />
            <div
              className={style["searchbar"]}
              children={
                <Searchbar
                  withMinWidth={false}
                  onChange={(event) => {
                    handleSearch(event);
                    setText(event.target.value);
                  }}
                  withTune={false}
                  placeholder={translation.app.create.members.search_user}
                />
              }
            />
            <div className={style["list-container"]}>
              <Scrollbar>
                {results.map((user: UserPreview) => (
                  <MemberItem user={user} key={user.uuid} onChange={(selected) => handleChange(user, selected)} />
                ))}
              </Scrollbar>
            </div>
          </div>
          <div className={style["button-container"]}>
            <div className={style["button"]} children={<Button children={translation.app.create.create} type={"submit"} disabled={disabled || isSubmitting || !(isValid && isDirty)} />} />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

interface MemberItemProps {
  user: UserPreview;
  onChange?: (selected: boolean) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ user, onChange }): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div
      className={style["item-container"]}
      onClick={() => {
        const value: boolean = !checked;
        setChecked(value);
        onChange && onChange(value);
      }}
    >
      <div className={style["item"]}>
        <span className={style["checkbox"]}>
          <Checkbox checked={checked} />
        </span>
        <Avatar className={style["avatar"]} src={user.avatarURL} color={user.color} />
        <div className={style["title"]}>
          <h6 children={user.name} />
        </div>
        <div children={`@${user.tag}`} className={style["tag"]} />
      </div>
    </div>
  );
};

export default Create;

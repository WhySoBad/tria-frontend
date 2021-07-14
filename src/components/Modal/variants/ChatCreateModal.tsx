import React, { useState, useEffect } from "react";
import style from "../../../styles/modules/ChatCreateModal.module.scss";
import cn from "classnames";
import { IconButton, FormControlLabel, Avatar } from "@material-ui/core";
import { ModalProps } from "../Modal";
import Button from "../../Button/Button";
import { Close as CloseIcon, ChevronLeft as BackIcon } from "@material-ui/icons";
import baseStyle from "../../../styles/modules/Modal.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input, { Checkbox, Searchbar } from "../../Input/Input";
import { checkGroupTag, GroupRole, GroupType, SearchOptions, UserPreview } from "client";
import { useClient } from "../../../hooks/ClientContext";
import Scrollbar from "../../Scrollbar/Scrollbar";
import { debounce, debouncedPromise } from "../../../util";

interface ChatCreateModalProps extends ModalProps {}

const ChatCreateModal: React.FC<ChatCreateModalProps> = ({ onClose, ...rest }): JSX.Element => {
  const [members, setMembers] = useState<Array<UserPreview>>([]);
  const [selected, setSelected] = useState<"FORM" | "SELECT">("FORM");

  return (
    <>
      <div className={style["stepper-head"]}>
        <div className={style["title-container"]}>
          <h3>{selected === "FORM" ? "Create Group" : "Select User"}</h3>
        </div>
        <div className={style["icon-container"]}>
          {selected === "SELECT" && <IconButton className={cn(baseStyle["iconbutton"], baseStyle["back"])} children={<BackIcon className={baseStyle["icon"]} />} onClick={() => setSelected("FORM")} />}
          <IconButton className={baseStyle["iconbutton"]} children={<CloseIcon className={baseStyle["icon"]} />} onClick={onClose} />
        </div>
      </div>
      <div className={style["stepper-content"]}>
        {selected === "FORM" && <Form onSelect={() => setSelected("SELECT")} members={members} onClose={onClose} />}
        {selected === "SELECT" && <MemberSelect members={members} onSelect={setMembers} />}
      </div>
    </>
  );
};

type Inputs = { name: string; tag: string; description: string; isPublic: boolean };

interface FormProps {
  onClose?: () => void;
  onSelect?: () => void;
  members: Array<UserPreview>;
}

const Form: React.FC<FormProps> = ({ members, onClose, onSelect }): JSX.Element => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });
  const { client } = useClient();

  const onSubmit: SubmitHandler<Inputs> = ({ name, tag, description = "", isPublic }) => {
    return new Promise((reject) => {
      client
        .createGroupChat({
          name: name,
          tag: tag,
          description: description,
          type: isPublic ? GroupType.GROUP : GroupType.PRIVATE_GROUP,
          avatar: null,
          members: members.map(({ uuid }) => ({ uuid: uuid, role: GroupRole.MEMBER })),
        })
        .catch(reject)
        .then(onClose);
    });
  };

  const isValidTag = debouncedPromise(async (tag: string): Promise<boolean> => {
    const exists: boolean = await checkGroupTag(tag);
    return !exists;
  }, 250);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style["form-container"]}>
      <div className={style["form-content"]}>
        <Input placeholder={"Name"} className={style["name"]} {...register("name", { required: true })} error={!!errors.name} />
        <Input
          placeholder={"Tag"}
          className={style["tag"]}
          onKeyDown={(event) => event.key.length === 1 && !event.key.match(/[A-Za-z0-9]/) && event.preventDefault()}
          {...register("tag", {
            required: true,
            pattern: /[A-Za-z0-9]+/,
            validate: isValidTag,
          })}
          error={!!errors.tag}
        />
        <Input placeholder={"Description"} className={style["description"]} {...register("description", { required: true })} error={!!errors.description} />
        <Controller
          name={"isPublic"}
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel label={"Public"} classes={{ root: style["public"], label: style["label"] }} control={<Checkbox {...field} />} />}
        />
        <div className={style["members"]}>
          <span className={style["link"]} onClick={onSelect} children={"Select members"} />
        </div>
      </div>
      <div className={style["submit"]}>
        <Button disabled={!isValid && !isSubmitting} children={"Create"} type={"submit"} />
      </div>
    </form>
  );
};

interface MemberSelectProps {
  members: Array<UserPreview>;
  onSelect: (members: Array<UserPreview>) => void;
}

const MemberSelect: React.FC<MemberSelectProps> = ({ onSelect, members }): JSX.Element => {
  const { client } = useClient();
  const [results, setResults] = useState<Array<UserPreview>>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let rendered: boolean = true;
    if (client) {
      const options: SearchOptions = { text: text, checkUser: true, checkName: true, checkTag: true };
      client
        .search(options)
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
    if (checked && !members.find((user) => user.uuid === uuid)) onSelect([...members, user]);
    if (!checked) onSelect(members.filter(({ uuid }) => uuid !== user.uuid));
  };

  const handleSearch = debounce((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    client.search({ text: event.target.value, checkUser: true, checkName: true, checkTag: true }).then(setResults).catch(client.error);
  }, 250);

  return (
    <section className={style["select-container"]}>
      <Searchbar
        placeholder={"Search user"}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          setText(event.target.value);
          handleSearch(event);
        }}
      />
      <div className={style["item-container"]}>
        <Scrollbar>
          {members.map((user: UserPreview) => {
            if (results.find(({ uuid }) => uuid === user.uuid) || text === "") {
              return <MemberItem user={user} key={user.uuid} onChange={(selected) => handleChange(user, selected)} selected={!!members.find(({ uuid }) => uuid === user.uuid)} />;
            }
          })}
          {results.map((user: UserPreview) => {
            if (!members.find(({ uuid }) => uuid === user.uuid)) {
              return <MemberItem user={user} key={user.uuid} onChange={(selected) => handleChange(user, selected)} selected={!!members.find(({ uuid }) => uuid === user.uuid)} />;
            }
          })}
        </Scrollbar>
      </div>
    </section>
  );
};

interface MemberItemProps {
  user: UserPreview;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ user, selected = false, onChange }): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (checked !== selected) setChecked(selected);
  }, [selected]);

  const handleCheck = (checked: boolean) => {
    setChecked(checked);
    onChange && onChange(checked);
  };

  return (
    <div className={style["item"]} onClick={() => handleCheck(!checked)}>
      <span className={style["checkbox"]}>
        <Checkbox checked={checked} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCheck(event.target.checked)} />
      </span>
      <Avatar className={style["avatar"]} style={{ backgroundColor: user.color }} />
      <div className={style["title"]}>
        <h6 children={user.name} />
      </div>
      <div children={user.tag} className={style["description"]} />
    </div>
  );
};

export default ChatCreateModal;

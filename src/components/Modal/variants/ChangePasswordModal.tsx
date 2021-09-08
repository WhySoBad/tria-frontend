import { IconButton } from "@material-ui/core";
import { Close as CloseIcon, Visibility as ShownIcon, VisibilityOff as HiddenIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useClient } from "../../../hooks/ClientContext";
import { useLang } from "../../../hooks/LanguageContext";
import style from "../../../styles/modules/ChangePasswordModal.module.scss";
import Button, { TextButton } from "../../Button";
import Input from "../../Input";
import Snackbar from "../../Snackbar";
import { ModalProps } from "../Modal";

interface ChangePasswordModalProps extends ModalProps {}

type Inputs = {
  password: string;
  newPassword: string;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const { translation } = useLang();
  const [hidden, setHidden] = useState<boolean>(true);
  const [newHidden, setNewHidden] = useState<boolean>(true);
  const router = useRouter();
  const { client } = useClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    client.changePassword(data.password, data.newPassword).then(onClose).catch(setSnackError);
  };

  return (
    <div className={style["container"]}>
      <h4 children={translation.modals.change_password.title} className={style["title"]} />
      <div className={style["close-container"]} children={<IconButton className={style["close"]} children={<CloseIcon className={style["icon"]} />} onClick={onClose} />} />
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <div className={style["password-container"]}>
            <Input
              className={style["password"]}
              placeholder={translation.modals.change_password.old_password}
              {...register("password", { required: true })}
              error={!!errors.password}
              type={hidden ? "password" : "text"}
              endAdornment={
                <IconButton disableRipple className={style["iconbutton"]} onClick={() => setHidden(!hidden)}>
                  {hidden ? <HiddenIcon className={style["icon"]} /> : <ShownIcon className={style["icon"]} />}
                </IconButton>
              }
            />
            <span
              className={style["forgot"]}
              children={
                <TextButton
                  children={translation.modals.change_password.forgot}
                  onClick={() => {
                    router.push("/passwordreset");
                    onClose && onClose();
                  }}
                />
              }
            />
          </div>
          <Input
            className={style["new-password"]}
            placeholder={translation.modals.change_password.new_password}
            {...register("newPassword", { required: true })}
            error={!!errors.newPassword}
            type={newHidden ? "password" : "text"}
            endAdornment={
              <IconButton disableRipple className={style["iconbutton"]} onClick={() => setNewHidden(!newHidden)}>
                {newHidden ? <HiddenIcon className={style["icon"]} /> : <ShownIcon className={style["icon"]} />}
              </IconButton>
            }
          />

          <div className={style["button-container"]}>
            <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.modals.change_password.submit} />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

export default ChangePasswordModal;

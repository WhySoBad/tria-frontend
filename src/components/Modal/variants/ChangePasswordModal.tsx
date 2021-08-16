import { IconButton } from "@material-ui/core";
import { Close as CloseIcon, Visibility as ShownIcon, VisibilityOff as HiddenIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useClient } from "../../../hooks/ClientContext";
import style from "../../../styles/modules/ChangePasswordModal.module.scss";
import Button, { TextButton } from "../../Button/Button";
import Input from "../../Input/Input";
import Snackbar from "../../Snackbar/Snackbar";
import { ModalProps } from "../Modal";

interface ChangePasswordModalProps extends ModalProps {}

type Inputs = {
  password: string;
  newPassword: string;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const [hidden, setHidden] = useState<boolean>(true);
  const [newHidden, setNewHidden] = useState<boolean>(true);
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
      <h4 children={"Change Password"} className={style["title"]} />
      <div className={style["close-container"]} children={<IconButton className={style["close"]} children={<CloseIcon className={style["icon"]} />} onClick={onClose} />} />
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <div className={style["password-container"]}>
            <Input
              className={style["password"]}
              placeholder={"Old Password"}
              {...register("password", { required: true })}
              error={!!errors.password}
              type={hidden ? "password" : "text"}
              endAdornment={
                <IconButton disableRipple className={style["iconbutton"]} onClick={() => setHidden(!hidden)}>
                  {hidden ? <HiddenIcon className={style["icon"]} /> : <ShownIcon className={style["icon"]} />}
                </IconButton>
              }
            />
            <span className={style["forgot"]} children={<TextButton children={"Forgot Password"} />} />
          </div>
          <Input
            className={style["new-password"]}
            placeholder={"New Password"}
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
            <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={"Change Password"} />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

export default ChangePasswordModal;

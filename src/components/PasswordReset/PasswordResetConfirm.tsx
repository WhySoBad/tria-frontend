import { IconButton } from "@material-ui/core";
import { Visibility as HiddenIcon, VisibilityOff as ShownIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { confirmPasswordReset } from "client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/PasswordReset.module.scss";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Snackbar from "../Snackbar/Snackbar";

interface PasswordResetConfirmProps {
  token: string;
}

type Inputs = {
  password: string;
};

const PasswordResetConfirm: React.FC<PasswordResetConfirmProps> = ({ token }): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const [hidden, setHidden] = useState<boolean>(true);
  const { translation } = useLang();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    confirmPasswordReset(token, data.password)
      .then(() => router.push("/login"))
      .catch(setSnackError);
  };

  return (
    <>
      <title children={translation.sites.passwordreset_confirm} />
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={"Password Reset"} className={style["title"]} />
        <div className={style["description"]} children={translation.passwordreset.confirm_description} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input
              className={style["password"]}
              placeholder={translation.passwordreset.password}
              {...register("password", { required: true })}
              error={!!errors.password}
              type={hidden ? "password" : "text"}
              endAdornment={
                <IconButton disableRipple className={style["iconbutton"]} onClick={() => setHidden(!hidden)}>
                  {hidden ? <HiddenIcon className={style["icon"]} /> : <ShownIcon className={style["icon"]} />}
                </IconButton>
              }
            />
            <div className={style["button-container"]}>
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.passwordreset.finish} />
            </div>
          </form>
        </div>
        <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
      </div>
    </>
  );
};

export default PasswordResetConfirm;

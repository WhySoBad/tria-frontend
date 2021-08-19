import { IconButton } from "@material-ui/core";
import { Visibility as HiddenIcon, VisibilityOff as ShownIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/AuthContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Login.module.scss";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import Button, { TextButton } from "../Button/Button";
import Input from "../Input/Input";
import Snackbar from "../Snackbar/Snackbar";

type Inputs = {
  username: string;
  password: string;
};

const Login: React.FC = (): JSX.Element => {
  const [hidden, setHidden] = useState<boolean>(true);
  const { login } = useAuth();
  const { translation } = useLang();
  const [snackError, setSnackError] = useState<string>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    login(data)
      .then(() => router.push("/app"))
      .catch(setSnackError);
  };

  return (
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={translation.login.title} className={style["title"]} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input className={style["username"]} placeholder={translation.login.mail} type={"mail"} {...register("username", { required: true, pattern: /\S+@\S+\.\S+/ })} error={!!errors.username} />
            <div className={style["password-container"]}>
              <Input
                className={style["password"]}
                placeholder={translation.login.password}
                {...register("password", { required: true })}
                error={!!errors.password}
                type={hidden ? "password" : "text"}
                endAdornment={
                  <IconButton disableRipple className={style["iconbutton"]} onClick={() => setHidden(!hidden)}>
                    {hidden ? <HiddenIcon className={style["icon"]} /> : <ShownIcon className={style["icon"]} />}
                  </IconButton>
                }
              />
              <span className={style["forgot"]} children={<TextButton children={translation.login.forgot} onClick={() => router.push("/passwordreset")} />} />
            </div>

            <div className={style["button-container"]}>
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.login.login} />
            </div>
          </form>
        </div>
        <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
      </div>
    </>
  );
};

export default Login;

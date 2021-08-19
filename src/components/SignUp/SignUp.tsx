import { IconButton } from "@material-ui/core";
import { Visibility as HiddenIcon, VisibilityOff as ShownIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { checkUserMail, registerUser } from "client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/SignUp.module.scss";
import { debouncedPromise } from "../../util";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Snackbar from "../Snackbar/Snackbar";

type Inputs = {
  username: string;
  password: string;
};

const SignUp: React.FC = (): JSX.Element => {
  const { translation } = useLang();
  const [hidden, setHidden] = useState<boolean>(true);
  const [snackError, setSnackError] = useState<string>();
  const [snackSuccess, setSnackSuccess] = useState<string>();
  const [checkedMail, setCheckedMail] = useState<{ mail: string; valid: boolean }>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    registerUser(data)
      .then(() => {
        router.push("/");
        setSnackSuccess("Verification Mail Sent");
      })
      .catch(setSnackError);
  };

  const isValidMail = debouncedPromise(async (mail: string): Promise<boolean> => {
    if (checkedMail?.mail === mail) return checkedMail.valid;
    const exists: boolean = await checkUserMail(mail);
    if (exists) setSnackError("Mail Has To Be Unique");
    setCheckedMail({ mail: mail, valid: !exists });
    return !exists;
  }, 250);

  return (
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={translation.signup.title} className={style["title"]} />
        <div className={style["description"]} children={translation.signup.description} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input
              className={style["username"]}
              placeholder={translation.signup.mail}
              type={"mail"}
              {...register("username", { required: true, pattern: /\S+@\S+\.\S+/, validate: isValidMail })}
              error={!!errors.username}
            />
            <Input
              className={style["password"]}
              placeholder={translation.signup.password}
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
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.signup.signup} />
            </div>
          </form>
        </div>
        <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
        <Snackbar open={!!snackSuccess} onClose={() => setSnackSuccess(null)} children={<Alert severity={"success"} children={snackSuccess} />} />
      </div>
    </>
  );
};

export default SignUp;

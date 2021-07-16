import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "../../styles/modules/SignUp.module.scss";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useRouter } from "next/router";
import { IconButton } from "@material-ui/core";
import { Visibility as HiddenIcon, VisibilityOff as ShownIcon } from "@material-ui/icons";
import { checkUserMail, registerUser, validateRegister } from "client";
import Snackbar from "../Snackbar/Snackbar";
import { Alert } from "@material-ui/lab";
import { debouncedPromise } from "../../util";
import { useEffect } from "react";

type Inputs = {
  username: string;
  password: string;
};

const SignUp: React.FC = (): JSX.Element => {
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
    <div className={style["container"]}>
      <h4 children={"Sign Up"} className={style["title"]} />
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <Input
            className={style["username"]}
            placeholder={"Mail"}
            type={"mail"}
            {...register("username", { required: true, pattern: /\S+@\S+\.\S+/, validate: isValidMail })}
            error={!!errors.username}
          />
          <Input
            className={style["password"]}
            placeholder={"Password"}
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
            <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={"Sign Up"} />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
      <Snackbar open={!!snackSuccess} onClose={() => setSnackSuccess(null)} children={<Alert severity={"success"} children={snackSuccess} />} />
    </div>
  );
};

export default SignUp;

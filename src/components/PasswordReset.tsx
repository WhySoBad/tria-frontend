import { Alert } from "@material-ui/lab";
import { requestPasswordReset } from "client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLang } from "../hooks";
import style from "../styles/modules/PasswordReset.module.scss";
import AnimatedBackground from "./AnimatedBackground";
import Button from "./Button";
import Input from "./Input";
import Snackbar from "./Snackbar";

type Inputs = {
  mail: string;
};

const PasswordReset: React.FC = (): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const [snackSuccess, setSnackSuccess] = useState<string>();
  const { translation } = useLang();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    requestPasswordReset(data.mail)
      .then(() => {
        setSnackSuccess("Mail Sent");
        reset({ mail: "" });
      })
      .catch(setSnackError);
  };

  return (
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={translation.passwordreset.title} className={style["title"]} />
        <div className={style["description"]} children={translation.passwordreset.description} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input className={style["mail"]} placeholder={translation.passwordreset.mail} type={"mail"} {...register("mail", { required: true, pattern: /\S+@\S+\.\S+/ })} error={!!errors.mail} />
            <div className={style["button-container"]}>
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.passwordreset.send_mail} />
            </div>
          </form>
        </div>
        <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
        <Snackbar open={!!snackSuccess} onClose={() => setSnackSuccess(null)} children={<Alert severity={"success"} children={snackSuccess} />} />
      </div>
    </>
  );
};

export default PasswordReset;

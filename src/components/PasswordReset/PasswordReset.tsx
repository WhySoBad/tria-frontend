import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import style from "../../styles/modules/PasswordReset.module.scss";
import { Alert } from "@material-ui/lab";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Snackbar from "../Snackbar/Snackbar";
import { requestPasswordReset } from "client";

type Inputs = {
  mail: string;
};

const PasswordReset: React.FC = (): JSX.Element => {
  const [snackError, setSnackError] = useState<string>();
  const [snackSuccess, setSnackSuccess] = useState<string>();
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
        <h4 children={"Password Reset"} className={style["title"]} />
        <div className={style["description"]} children={"Enter the mail address with which your account was created. You'll recieve a mail with a link to finish the password reset."} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input className={style["mail"]} placeholder={"Mail"} type={"mail"} {...register("mail", { required: true, pattern: /\S+@\S+\.\S+/ })} error={!!errors.mail} />
            <div className={style["button-container"]}>
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={"Send Mail"} />
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

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { checkUserTag, Locale, verifyRegister } from "client";
import style from "../../styles/modules/Register.module.scss";
import Input, { Select } from "../Input/Input";
import Button, { TextButton } from "../Button/Button";
import { debouncedPromise } from "../../util";
import { useRouter } from "next/router";
import Snackbar from "../Snackbar/Snackbar";
import { Alert } from "@material-ui/lab";

interface RegisterProps {}

type Inputs = {
  name: string;
  tag: string;
  description: string;
  locale: Locale;
};

const Register: React.FC<RegisterProps> = (): JSX.Element => {
  const [defaultLocale, setDefaultLocale] = useState<Locale>();
  const [snackError, setSnackError] = useState<string>();
  const [checkedTag, setCheckedTag] = useState<{ tag: string; valid: boolean }>();
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange", defaultValues: { locale: defaultLocale } });

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const token: string = router.query.token as string;
    verifyRegister(token, data)
      .then(() => router.push("/login"))
      .catch(setSnackError);
  };

  useEffect(() => {
    const lang: string = navigator.language.length > 2 ? navigator.language.split("-")[1] : navigator.language;
    setDefaultLocale(lang === "DE" ? "DE" : lang === "FR" ? "FR" : "EN");
  }, []);

  const isValidTag = debouncedPromise(async (tag: string): Promise<boolean> => {
    if (checkedTag?.tag === tag) return checkedTag?.valid;
    const exists: boolean = await checkUserTag(tag);
    if (exists) setSnackError("Tag Has To Be Unique");
    setCheckedTag({ tag: tag, valid: !exists });
    return !exists;
  }, 250);

  if (!defaultLocale) return <></>;

  return (
    <div className={style["container"]}>
      <h4 children={"Finish Registration"} className={style["title"]} />
      <div className={style["form-container"]}>
        <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
          <Input className={style["name"]} placeholder={"Username"} {...register("name", { required: true })} error={!!errors.name} />
          <Input
            className={style["tag"]}
            onKeyDown={(event) => event.key.length === 1 && !event.key.match(/[A-Za-z0-9]/) && event.preventDefault()}
            placeholder={"Tag"}
            {...register("tag", { validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true })}
            error={!!errors.tag}
          />
          <Input className={style["description"]} placeholder={"Description"} {...register("description", { required: true })} error={!!errors.description} />
          <div
            className={style["locale"]}
            children={
              <Controller
                name={"locale"}
                control={control}
                defaultValue={defaultLocale}
                render={({ field: { onChange, ...rest } }) => (
                  <Select
                    onChange={(event) => onChange && onChange((event as any).value)}
                    values={[
                      { value: "EN", label: "English" },
                      { value: "DE", label: "German" },
                      { value: "FR", label: "French" },
                    ]}
                    {...rest}
                  />
                )}
              />
            }
          />
          <div className={style["button-container"]}>
            <TextButton children={"Close"} onClick={() => router.push("/")} />
            <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={"Finish"} />
          </div>
        </form>
      </div>
      <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
    </div>
  );
};

export default Register;

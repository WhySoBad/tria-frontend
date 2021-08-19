import { Alert } from "@material-ui/lab";
import { checkUserTag, Locale, verifyRegister } from "client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Register.module.scss";
import { debouncedPromise } from "../../util";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import Button from "../Button/Button";
import Input, { Select } from "../Input/Input";
import Snackbar from "../Snackbar/Snackbar";

interface RegisterProps {}

type Inputs = {
  name: string;
  tag: string;
  description: string;
  locale: Locale;
};

const Register: React.FC<RegisterProps> = (): JSX.Element => {
  const [defaultLocale, setDefaultLocale] = useState<Locale>();
  const { translation } = useLang();
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
    setDefaultLocale(lang === "DE" ? "DE" : lang === "FR" ? "EN" : "EN");
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
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={translation.register.title} className={style["title"]} />
        <div className={style["description"]} children={translation.register.form_description} />
        <div className={style["form-container"]}>
          <form className={style["form"]} onSubmit={handleSubmit(onSubmit)}>
            <Input className={style["name"]} placeholder={translation.register.username} {...register("name", { required: true })} error={!!errors.name} />
            <Input
              className={style["tag"]}
              onKeyDown={(event) => event.key.length === 1 && !event.key.match(/[A-Za-z0-9]/) && event.preventDefault()}
              placeholder={translation.register.tag}
              {...register("tag", { validate: isValidTag, pattern: /[A-Za-z0-9]+/, required: true })}
              error={!!errors.tag}
            />
            <Input className={style["description"]} placeholder={translation.register.description} {...register("description", { required: true })} error={!!errors.description} />
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
                        { value: "EN", label: translation.locales.EN },
                        { value: "DE", label: translation.locales.DE },
                        { value: "FR", label: translation.locales.FR, disabled: true },
                      ]}
                      {...rest}
                    />
                  )}
                />
              }
            />
            <div className={style["button-container"]}>
              <Button type={"submit"} disabled={!(isValid && isDirty) || isSubmitting} children={translation.register.finish} />
            </div>
          </form>
        </div>
        <Snackbar open={!!snackError} onClose={() => setSnackError(null)} children={<Alert severity={"error"} children={snackError} />} />
      </div>
    </>
  );
};

export default Register;

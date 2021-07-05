import React, { FC, useState } from "react";
import style from "../../../styles/modules/Sections.module.scss";
import cn from "classnames";
import Input from "../../Input/Input";
import Button from "../../Button/Button";
import { registerUser } from "client";
import { useAuth } from "../../../hooks/AuthContext";
import Router from "next/router";

const Authentication: FC = (): JSX.Element => {
  return (
    <section id={"auth"} className={style["auth-container"]}>
      <div className={cn(style["auth-stripe"], style["top"])} />
      <div className={cn(style["auth-stripe"], style["bottom"])} />
      <div className={style["auth-content"]}>
        <Register />
        <Login />
      </div>
    </section>
  );
};

const Register: FC = (): JSX.Element => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const disabled: boolean = !Boolean(username) || !Boolean(password);

  const handleRegister: () => void = (): void => {
    registerUser({ username: username, password: password })
      .then(() => {})
      .catch(() => {});
  };

  return (
    <div className={cn(style["auth-child"], style["auth-register"])}>
      <h3>Register</h3>
      <Input error={hasError} className={style["auth-input"]} type={"text"} placeholder={"Username"} onBlur={({ target: { value } }) => setUsername(value)} />
      <Input error={hasError} className={style["auth-input"]} type={"password"} placeholder={"Password"} onBlur={({ target: { value } }) => setPassword(value)} />
      <Button children={"Register"} disabled={disabled} onClick={handleRegister} />
    </div>
  );
};

const Login: FC = (): JSX.Element => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const disabled: boolean = !Boolean(username) || !Boolean(password);

  const handleLogin: () => void = (): void => {
    setLoading(true);
    login({ username: username, password: password })
      .then(() => Router.push("/app"))
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <div className={cn(style["auth-child"], style["auth-login"])}>
      <h3>Login</h3>
      <Input
        error={hasError}
        className={style["auth-input"]}
        type={"text"}
        placeholder={"Username"}
        onChange={({ target: { value } }) => setUsername(value)}
        onKeyDown={(event) => event.key === "Enter" && !disabled && handleLogin()}
      />
      <Input
        error={hasError}
        className={style["auth-input"]}
        type={"password"}
        placeholder={"Password"}
        onChange={({ target: { value } }) => setPassword(value)}
        onKeyDown={(event) => event.key === "Enter" && !disabled && handleLogin()}
      />
      <Button children={"Login"} disabled={disabled} onClick={handleLogin} />
    </div>
  );
};

export default Authentication;

import React, { useEffect, useState } from "react";
import cn from "classnames";
import style from "../../styles/modules/Header.module.scss";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/AuthContext";
import { Button as Btn } from "@material-ui/core";
import Link from "next/link";

const Header = (): JSX.Element => {
  const { token, validate } = useAuth();
  const [canLogin, setCanLogin] = useState<boolean>(null);

  useEffect(() => {
    if (token) {
      validate()
        .then((valid: boolean) => setCanLogin(valid))
        .catch(() => setCanLogin(false));
    } else setCanLogin(false);
  }, []);

  return (
    <header className={style["container"]}>
      <div className={cn(style["child"], style["logo-container"])} children={<h3 children={"Name"} />} />
      <div className={cn(style["child"], style["navigation-container"])}></div>
      <div className={cn(style["child"])}>
        {canLogin !== null && !canLogin && <Button text={"Authentication"} to={"#auth"} />}
        {/*  {canLogin !== null && canLogin && <Button text={"To App"} to={"/app"} />} */}
        {canLogin !== null && canLogin && (
          <Link href={{ pathname: "/login", query: "url=/app" }}>
            <Btn children={"To App"} disableElevation variant={"contained"} size={"large"} classes={{ root: style["button"] }} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

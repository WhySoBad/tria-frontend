import React, { useEffect, useState } from "react";
import cn from "classnames";
import style from "../../styles/modules/Header.module.scss";
import { useAuth } from "../../hooks/AuthContext";
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
      <div className={style["logo-container"]} children={<h3 /* children={"Name"} */ />} />
      <div className={style["navigation-container"]}>
        <Link href={"/login"} children={<h6 className={style["nav-link"]} children={"Login"} />} />
        <Link href={"/signup"} children={<h6 className={style["nav-link"]} children={"Sign Up"} />} />
        {canLogin && <Link href={"/app"} children={<h6 className={style["nav-link"]} children={"To App"} />} />}
      </div>
    </header>
  );
};

export default Header;

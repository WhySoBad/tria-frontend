import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Header.module.scss";

const Header = (): JSX.Element => {
  const { token, validate } = useAuth();
  const { translation } = useLang();
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
      <div className={style["logo-container"]} children={<h3 />} />
      <div className={style["navigation-container"]}>
        <Link href={"/login"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.login} />} />
        <Link href={"/signup"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.signup} />} />
        {canLogin && <Link href={"/app"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.to_app} />} />}
      </div>
    </header>
  );
};

export default Header;

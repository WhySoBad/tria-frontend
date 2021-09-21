import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth, useLang } from "../hooks";
import style from "../styles/modules/Header.module.scss";

const Header = (): JSX.Element => {
  const { token, validate } = useAuth();
  const { translation } = useLang();
  const [canLogin, setCanLogin] = useState<boolean>(null); //boolean whether there is an existing auth token
  const router = useRouter();

  useEffect(() => {
    if (token) {
      validate()
        .then((valid: boolean) => setCanLogin(valid))
        .catch(() => setCanLogin(false));
    } else setCanLogin(false);
  }, []);

  return (
    <header className={style["container"]}>
      <div className={style["logo-container"]}>
        <Link href={"/"}>
          <svg style={{ height: "30px" }} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.99 84">
            <polygon className={style["logo"]} fill={"#FFFFFF"} points="48.5 6 5.2 81 91.8 81 48.5 6" />
          </svg>
        </Link>
      </div>
      <div className={style["navigation-container"]}>
        {router.pathname !== "/" && <Link href={"/"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.home} />} />}
        {router.pathname !== "/login" && <Link href={"/login"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.login} />} />}
        {router.pathname !== "/signup" && <Link href={"/signup"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.signup} />} />}
        {canLogin && <Link href={"/app"} children={<h6 className={style["nav-link"]} children={translation.landing.quicknav.to_app} />} />}
      </div>
    </header>
  );
};

export default Header;

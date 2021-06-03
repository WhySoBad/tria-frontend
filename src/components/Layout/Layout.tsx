import React from "react";
import style from "../../styles/modules/Layout.module.scss";
import Burger from "../Burger/Burger";
import BurgerMenu from "../Burger/BurgerMenu";
import ProfileMenu from "../Profile/ProfileMenu";

const Layout: React.FC = ({ children }): JSX.Element => {
  return (
    <main className={style["container"]}>
      <section className={style["burger-container"]} children={<Burger />} />
      <section className={style["content-container"]} children={children} />
      <section className={style["burger-menu-container"]} children={<BurgerMenu />} />
      <section className={style["profile-menu-container"]} children={<ProfileMenu />} />
    </main>
  );
};

export default Layout;

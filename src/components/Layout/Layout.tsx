import { useMediaQuery, Drawer, IconButton } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import style from "../../styles/modules/Layout.module.scss";
import Burger from "../Burger/Burger";
import BurgerMenu from "../Burger/BurgerMenu";
import ProfileMenu from "../Profile/ProfileMenu";

const Layout: React.FC = ({ children }): JSX.Element => {
  const matches = useMediaQuery("(min-width: 800px)");
  const ref = useRef<HTMLDivElement>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (ref?.current?.clientWidth <= 800) {
      setOpen(false);
      setDrawer(true);
    } else {
      setOpen(false);
      setDrawer(false);
    }
  }, [matches]);

  return (
    <main className={style["container"]} ref={ref}>
      {!drawer && <section className={style["burger-container"]} children={<Burger />} />}
      {drawer && (
        <>
          <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <section className={style["burger-container"]} children={<Burger onClick={() => setOpen(false)} />} />
          </Drawer>
          <section className={style["collapsed-burger-container"]}>
            <div>
              <IconButton disableRipple className={style["iconbutton"]} size={"medium"} onClick={() => setOpen(true)} children={<MenuIcon className={style["icon"]} />} />
            </div>
          </section>
        </>
      )}
      <section className={style["content-container"]} children={children} />
      <section className={style["burger-menu-container"]} children={<BurgerMenu />} />
      <section className={style["profile-menu-container"]} children={<ProfileMenu />} />
    </main>
  );
};

export default Layout;

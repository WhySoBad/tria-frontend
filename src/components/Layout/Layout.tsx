import { useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useClient } from "../../hooks/ClientContext";
import style from "../../styles/modules/Layout.module.scss";
import Burger from "../Burger/Burger";
import Scrollbar from "../Scrollbar/Scrollbar";

const Layout: React.FC = ({ children }): JSX.Element => {
  const matches = useMediaQuery("(min-width: 800px)");
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>();
  const { client } = useClient();
  const router = useRouter();

  useEffect(() => {
    if (!client) router.push({ pathname: "/auth", query: `url=${router.asPath}` });
  }, []);

  useEffect(() => {
    if (ref?.current?.clientWidth <= 800) setOpen(false);
    else setOpen(true);
  }, [ref.current]);

  if (!client) return <></>;

  return (
    <main className={style["container"]} data-open={open} ref={ref}>
      {typeof open !== "undefined" && (
        <section
          className={style["burger-container"]}
          data-open={open}
          children={<Burger open={open} onClick={() => ref?.current?.clientWidth <= 800 && open && setOpen(false)} onCollapse={() => setOpen(!open)} />}
        />
      )}
      <section className={style["content-container"]} children={children} data-overflow={open && !matches} />
    </main>
  );
};

interface FormLayoutProps {
  small?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = ({ children, small = false }): JSX.Element => {
  return (
    <main className={style["form-layout-container"]}>
      <section className={style["form-container"]}>
        <div className={style["form-content"]} data-small={small} children={children} />
      </section>
    </main>
  );
};

export default Layout;

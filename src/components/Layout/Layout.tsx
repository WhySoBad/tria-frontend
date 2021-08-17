import { useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useBurger } from "../../hooks/BurgerContext";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Layout.module.scss";
import Burger from "../Burger/Burger";
import Footer from "../Footer/Footer";
import Scrollbar from "../Scrollbar/Scrollbar";

const Layout: React.FC = ({ children }): JSX.Element => {
  const matches = useMediaQuery("(min-width: 800px)");
  const { language, setLanguage } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { open, setOpen } = useBurger();
  const { client } = useClient();
  const router = useRouter();
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    if (!client) router.push({ pathname: "/auth", query: `url=${router.asPath}` });
  }, []);

  useEffect(() => {
    if (ref?.current?.clientWidth <= 800) setOpen(false);
    else if (open === undefined) setOpen(true);
    setRendered(true);
  }, [ref.current]);

  useEffect(() => {
    setOpen(!(rendered && !matches && matches !== null));
  }, [matches]);

  useEffect(() => {
    if (client && language !== client.user.locale) setLanguage(client.user.locale);
  }, [children]);

  if (!client) return <></>;

  return (
    <main className={style["container"]} data-open={open} ref={ref} onContextMenu={(event) => event.preventDefault()}>
      {typeof open !== "undefined" && (
        <section
          className={style["burger-container"]}
          data-overflow={rendered && !matches && matches !== null}
          data-open={open}
          children={<Burger onClick={() => ref?.current?.clientWidth <= 800 && open && setOpen(false)} />}
        />
      )}
      <section className={style["content-container"]} children={children} data-overflow={rendered && !matches && matches !== null} />
    </main>
  );
};

interface FormLayoutProps {
  small?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = ({ children, small = false }): JSX.Element => {
  return (
    <main>
      <Scrollbar style={{ height: "100vh" }}>
        <main className={style["form-layout-container"]}>
          <section className={style["form-container"]}>
            <div className={style["form-content"]} data-small={small} children={children} />
          </section>
        </main>
        <Footer />
      </Scrollbar>
    </main>
  );
};

export default Layout;

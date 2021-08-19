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
            <div className={style["background-container"]}>
              <svg className={style["section-transition"]} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className={style["fill"]}
                  fillOpacity="1"
                ></path>
              </svg>
              <div className={style["background"]} />
            </div>
          </section>
        </main>
        <Footer />
      </Scrollbar>
    </main>
  );
};

export default Layout;

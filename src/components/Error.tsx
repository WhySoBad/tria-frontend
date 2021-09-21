import { useRouter } from "next/router";
import React from "react";
import { useLang } from "../hooks";
import style from "../styles/modules/Error.module.scss";
import AnimatedBackground from "./AnimatedBackground";
import Button from "./Button";

interface ErrorProps {
  code: number;
}

const Error: React.FC<ErrorProps> = ({ code }): JSX.Element => {
  const { translation } = useLang();
  const data: { title: string; description: string } = code === 404 ? translation.error[404] : translation.error[500];
  const router = useRouter();
  return (
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={data.title} />
        <div className={style["text"]} children={data.description} />
        <div className={style["button"]} children={<Button children={translation.error.back} onClick={() => router.push("/")} />} />
      </div>
    </>
  );
};

export default Error;

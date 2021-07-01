import React from "react";
import style from "../../styles/modules/Create.module.scss";

interface CreateProps {}

const Create: React.FC<CreateProps> = (): JSX.Element => {
  return (
    <main className={style["container"]}>
      <section className={style["title-container"]}>
        <h3 className={style["title"]} children={"Create Group"} />
      </section>
      <section className={style["content-container"]}></section>
    </main>
  );
};

export default Create;

import React from "react";
import style from "../../styles/modules/Profile.module.scss";

const Profile: React.FC = (): JSX.Element => {
  return (
    <main className={style["container"]}>
      <section className={style["title-container"]}>
        <h3 className={style["title"]} children={"Profile"} />
      </section>
      <section className={style["content-container"]}></section>
    </main>
  );
};

export default Profile;

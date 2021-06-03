import React, { FC, useEffect, useState } from "react";
import style from "../../styles/modules/Home.module.scss";
import { useClient } from "../../hooks/ClientContext";

const Home: FC = (): JSX.Element => {
  const { client } = useClient();
  const [selected, selectChat] = useState<string>();
  const [message, setMessage] = useState<string>();

  return <h2>Home</h2>;
};

export default Home;

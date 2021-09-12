import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useClient } from "../hooks/ClientContext";
import style from "../styles/modules/Auth.module.scss";

const Auth: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { client, fetchClient, isLoading } = useClient();
  const [url] = useState<string>(router.query.url as string);

  useEffect(() => {
    if (url && typeof url === "string") router.push("/auth", undefined, { shallow: true });
    else if (client && !url && !isLoading) router.push("/app");
    if (!client && !isLoading) fetchClient().catch(() => router.push("/"));
  }, []);

  useEffect(() => {
    if (client && url) router.push(url);
    else if (client && !url) router.push("/app");
  }, [client]);

  return <main className={style["container"]} children={<CircularProgress classes={{ root: style["loader"] }} />} />;
};

export default Auth;

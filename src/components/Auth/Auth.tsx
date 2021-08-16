import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useClient } from "../../hooks/ClientContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Auth.module.scss";

const Auth: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { client, fetchClient, isLoading } = useClient();
  const { translation } = useLang();
  const [url] = useState<string>(router.query.url as string);

  useEffect(() => {
    if (url && typeof url === "string") router.push("/auth", undefined, { shallow: true });
    else if (client || (!client && !isLoading && !url)) router.push("/app");
    else router.push("/");
    if (!client && !isLoading) fetchClient().catch(() => router.push("/"));
  }, []);

  useEffect(() => {
    if (client && url) router.push(url);
  }, [client]);

  return (
    <main className={style["container"]}>
      <title children={translation.sites.auth} />
      <CircularProgress classes={{ root: style["loader"] }} />
    </main>
  );
};

export default Auth;

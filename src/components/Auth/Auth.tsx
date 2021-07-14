import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useClient } from "../../hooks/ClientContext";

const Auth: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { client, fetchClient, isLoading } = useClient();
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

  return <></>;
};

export default Auth;

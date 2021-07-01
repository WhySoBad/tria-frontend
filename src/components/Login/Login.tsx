import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useClient } from "../../hooks/ClientContext";

const Login: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { client, fetchClient, isLoading } = useClient();
  const [url] = useState<string>(router.query.url as string);

  useEffect(() => {
    if (url && typeof url === "string") router.push("/login", undefined, { shallow: true });
    else router.push("/");
    if (!client && !isLoading) fetchClient().catch(() => router.push("/"));
  }, []);

  useEffect(() => {
    if (client && url) router.push(url);
  }, [client]);

  return <></>;
};

export default Login;

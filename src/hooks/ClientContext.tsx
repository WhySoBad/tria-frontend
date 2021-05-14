import React, { useEffect, useState } from "react";
import { Chat, Client, Message, validateToken } from "client";
import { NextPage } from "next";
import { useAuth } from "./AuthContext";

interface ClientContext {
  client: Client;
}

const defaultValue: ClientContext = {
  client: null,
};

interface Props {}

export const ClientContext = React.createContext<ClientContext>(defaultValue);

export const ClientProvider: NextPage<Props> = ({ children }): JSX.Element => {
  const { token } = useAuth();
  const [client, setClient] = useState<Client>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token && !client && !isLoading) fetchClient();
  }, [token]);

  const fetchClient: Function = () => {
    setLoading(true);
    validateToken(token)
      .then((valid: boolean) => {
        if (!valid) return console.error("Invalid Token");
        const client: Client = new Client({ token: token, log: true });
        client
          .connect()
          .then(() => setClient(client))
          .catch((err) => client.error("Error whilst connecting", err));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <ClientContext.Provider
      value={{
        client: client,
      }}
      children={children}
    />
  );
};

export const useClient = () => {
  const context = React.useContext(ClientContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

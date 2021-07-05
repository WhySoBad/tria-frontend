import React, { useState } from "react";
import { Client, validateToken } from "client";
import { NextPage } from "next";
import { useAuth } from "./AuthContext";

interface ClientContext {
  client: Client;
  isLoading: boolean;
  fetchClient: () => Promise<void>;
}

const defaultValue: ClientContext = {
  client: null,
  isLoading: false,
  fetchClient: async () => {},
};

export const ClientContext = React.createContext<ClientContext>(defaultValue);

export const ClientProvider: NextPage = ({ children }): JSX.Element => {
  const { token } = useAuth();
  const [client, setClient] = useState<Client>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchClient = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (client) resolve();
      if (!token) reject("Missing Token");
      if (isLoading) reject("Is Already Connecting");

      const valid: boolean = await validateToken(token);
      if (!valid) reject("Invalid Token");
      const newClient: Client = new Client({ token: token, log: true });
      await newClient.connect().catch(reject);
      setClient(newClient);
      setLoading(false);
    });
  };

  return (
    <ClientContext.Provider
      value={{
        client: client,
        isLoading: isLoading,
        fetchClient: fetchClient,
      }}
      children={children}
    />
  );
};

export const useClient = () => {
  const context = React.useContext(ClientContext);

  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

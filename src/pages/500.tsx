import { NextPage } from "next";
import React from "react";
import Error from "../components/Error/Error";
import { FormLayout } from "../components/Layout/Layout";
import Meta from "../components/Meta/Meta";
import { useLang } from "../hooks/LanguageContext";

const ServerSideErrorPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <Meta noindex description="Internal Server Error" title={translation.sites[500]} />
      <Error code={500} />
    </FormLayout>
  );
};

export default ServerSideErrorPage;

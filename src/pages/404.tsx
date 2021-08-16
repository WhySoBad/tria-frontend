import { NextPage } from "next";
import React from "react";
import Error from "../components/Error/Error";
import { FormLayout } from "../components/Layout/Layout";
import { useLang } from "../hooks/LanguageContext";

const NotFoundPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <title children={translation.sites[404]} />
      <Error code={404} />
    </FormLayout>
  );
};

export default NotFoundPage;
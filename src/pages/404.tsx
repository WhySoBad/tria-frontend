import { NextPage } from "next";
import React from "react";
import Error from "../components/Error";
import { FormLayout } from "../components/Layout";
import Meta from "../components/Meta";
import { useLang } from "../hooks";

const NotFoundPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <FormLayout>
      <Meta noindex description="Page Not Found" title={translation.sites[404]} />
      <Error code={404} />
    </FormLayout>
  );
};

export default NotFoundPage;

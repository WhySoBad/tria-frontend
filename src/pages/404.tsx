import { NextPage } from "next";
import React from "react";
import Error from "../components/Error/Error";
import { FormLayout } from "../components/Layout/Layout";

const NotFoundPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title children={"404 - Not Found"} />
      <FormLayout children={<Error code={404} text={"The requested URL was not found. Please make sure this page exists."} />} />
    </>
  );
};

export default NotFoundPage;

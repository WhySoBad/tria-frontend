import { NextPage } from "next";
import React from "react";
import Error from "../components/Error/Error";
import { FormLayout } from "../components/Layout/Layout";

const ServerSideErrorPage: NextPage = (): JSX.Element => {
  return (
    <>
      <title children={"500 - Error"} />
      <FormLayout children={<Error code={500} text={"A Server side error occured. This is probably a temporarily issue. Please come back and try again in a few minutes."} />} />
    </>
  );
};

export default ServerSideErrorPage;

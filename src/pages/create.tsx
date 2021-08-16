import { NextPage } from "next";
import React from "react";
import Create from "../components/Create/Create";
import Layout from "../components/Layout/Layout";

const CreatePage: NextPage = (): JSX.Element => <Layout children={<Create />} />;

export default CreatePage;

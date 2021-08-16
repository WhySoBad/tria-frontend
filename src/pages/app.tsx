import { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import { useLang } from "../hooks/LanguageContext";
import withAuth from "../hooks/WithAuth";

const AppPage: NextPage = (): JSX.Element => {
  const { translation } = useLang();
  return <Layout children={<title children={translation.sites.app} />} />;
};

export const getServerSideProps = withAuth();

export default AppPage;

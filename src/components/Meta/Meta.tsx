import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface MetaProps {
  description?: string;
  title?: string;
  noindex?: boolean;
  image?: string;
}

const Meta: React.FC<MetaProps> = ({ description, title, noindex, image }) => {
  const router = useRouter();
  return (
    <Head>
      {title && <title children={title} />}
      {title && <meta property="og:title" content={title} key="ogtitle" />}
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} key="ogdesc" />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={router.asPath} key="ogurl" />
      <meta name="robots" content={noindex ? "noindex" : "index"} />
    </Head>
  );
};

export default Meta;

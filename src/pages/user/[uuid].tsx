import { getUserPreview, UserPreview } from 'client';
import { NextPage, NextPageContext } from 'next';
import React from 'react';

interface Props {
  user?: UserPreview;
}

const UserPage: NextPage<Props> = ({ user }): JSX.Element => {
  return (
    <>
      <title children={'User'} />
    </>
  );
};

UserPage.getInitialProps = async (context: NextPageContext) => {
  const uuid: string = (context.query?.uuid as string) || '';
  const uuidRegex: RegExp =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  if (typeof uuid == 'string' && uuidRegex.test(uuid)) {
    const user: UserPreview = await getUserPreview(uuid).catch(() => undefined);
    return { user };
  } else return { user: undefined };
};

export default UserPage;

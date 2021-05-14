import React from 'react';
import { NextPageContext } from 'next';
import { validateToken } from 'client';
import Router from 'next/router';
import { parse } from 'cookie';

/**
 * Function to redirect to the login page
 *
 * @param context page context
 *
 * @returns void
 */

const loginRedirect: ({ res }: NextPageContext) => void = (
  context: NextPageContext,
) => {
  if (context.res) {
    context.res?.writeHead(302, { Location: '/#auth' });
    context.res?.end();
  } else Router.replace('/#auth');
};

const withAuth = (
  getServerSidePropsFunction?: (context: NextPageContext) => object,
) => {
  return async (context: NextPageContext) => {
    const token: string = parse(context.req?.headers?.cookie || '')?.token;
    if (!token) {
      loginRedirect(context);
      return { props: { token: null } };
    } else {
      const valid: boolean = await validateToken(token).catch(() => false);
      if (!valid) {
        loginRedirect(context);
        return { props: { token: null } };
      }
    }

    if (getServerSidePropsFunction) {
      return {
        props: { token: token, ...getServerSidePropsFunction(context) },
      };
    }
    return { props: { token: token } };
  };
};

export default withAuth;

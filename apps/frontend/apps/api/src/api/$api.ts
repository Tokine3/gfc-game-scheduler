import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_by08hd } from '.';
import type { Methods as Methods_nxcu13 } from './auth/discord';
import type { Methods as Methods_12zp75v } from './auth/discord/callback';
import type { Methods as Methods_10yceks } from './auth/verify';
import type { Methods as Methods_tli9od } from './user';
import type { Methods as Methods_13i5w2z } from './user/_id@string';
import type { Methods as Methods_9k2hsc } from './user/me';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '');
  const PATH0 = '/auth/discord';
  const PATH1 = '/auth/discord/callback';
  const PATH2 = '/auth/verify';
  const PATH3 = '/user';
  const PATH4 = '/user/me';
  const GET = 'GET';
  const POST = 'POST';
  const DELETE = 'DELETE';
  const PATCH = 'PATCH';

  return {
    auth: {
      discord: {
        callback: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_12zp75v['get']['status']>(prefix, PATH1, GET, option).send(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_12zp75v['get']['status']>(prefix, PATH1, GET, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH1}`,
        },
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_nxcu13['get']['status']>(prefix, PATH0, GET, option).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_nxcu13['get']['status']>(prefix, PATH0, GET, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH0}`,
      },
      verify: {
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_10yceks['get']['status']>(prefix, PATH2, GET, option).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_10yceks['get']['status']>(prefix, PATH2, GET, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH2}`,
      },
    },
    user: {
      _id: (val1: string) => {
        const prefix1 = `${PATH3}/${val1}`;

        return {
          patch: (option: { body: Methods_13i5w2z['patch']['reqBody'], config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods_13i5w2z['patch']['status']>(prefix, prefix1, PATCH, option).send(),
          $patch: (option: { body: Methods_13i5w2z['patch']['reqBody'], config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods_13i5w2z['patch']['status']>(prefix, prefix1, PATCH, option).send().then(r => r.body),
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_13i5w2z['delete']['status']>(prefix, prefix1, DELETE, option).send(),
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_13i5w2z['delete']['status']>(prefix, prefix1, DELETE, option).send().then(r => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      me: {
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_9k2hsc['get']['status']>(prefix, PATH4, GET, option).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_9k2hsc['get']['status']>(prefix, PATH4, GET, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH4}`,
      },
      post: (option: { body: Methods_tli9od['post']['reqBody'], config?: T | undefined }) =>
        fetch<void, BasicHeaders, Methods_tli9od['post']['status']>(prefix, PATH3, POST, option).send(),
      $post: (option: { body: Methods_tli9od['post']['reqBody'], config?: T | undefined }) =>
        fetch<void, BasicHeaders, Methods_tli9od['post']['status']>(prefix, PATH3, POST, option).send().then(r => r.body),
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_tli9od['get']['status']>(prefix, PATH3, GET, option).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_tli9od['get']['status']>(prefix, PATH3, GET, option).send().then(r => r.body),
      $path: () => `${prefix}${PATH3}`,
    },
    get: (option?: { config?: T | undefined } | undefined) =>
      fetch<void, BasicHeaders, Methods_by08hd['get']['status']>(prefix, '', GET, option).send(),
    $get: (option?: { config?: T | undefined } | undefined) =>
      fetch<void, BasicHeaders, Methods_by08hd['get']['status']>(prefix, '', GET, option).send().then(r => r.body),
    $path: () => `${prefix}`,
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

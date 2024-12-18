import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_i5cbq6 } from "./discord";
import type { Methods as Methods_1a5j3r0 } from "./discord/callback";
import type { Methods as Methods_1r95pbu } from "./servers";
import type { Methods as Methods_z11b77 } from "./verify";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/auth/discord";
  const PATH1 = "/auth/discord/callback";
  const PATH2 = "/auth/servers";
  const PATH3 = "/auth/verify";
  const GET = "GET";

  return {
    discord: {
      callback: {
        /**
         * @returns Discord認証成功
         */
        get: (option: {
          query: Methods_1a5j3r0["get"]["query"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_1a5j3r0["get"]["resBody"],
            BasicHeaders,
            Methods_1a5j3r0["get"]["status"]
          >(prefix, PATH1, GET, option).json(),
        /**
         * @returns Discord認証成功
         */
        $get: (option: {
          query: Methods_1a5j3r0["get"]["query"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_1a5j3r0["get"]["resBody"],
            BasicHeaders,
            Methods_1a5j3r0["get"]["status"]
          >(prefix, PATH1, GET, option)
            .json()
            .then((r) => r.body),
        $path: (
          option?:
            | {
                method?: "get" | undefined;
                query: Methods_1a5j3r0["get"]["query"];
              }
            | undefined,
        ) =>
          `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
      },
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_i5cbq6["get"]["status"]>(
          prefix,
          PATH0,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_i5cbq6["get"]["status"]>(
          prefix,
          PATH0,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
    servers: {
      /**
       * @returns Discordサーバー取得成功
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_1r95pbu["get"]["resBody"],
          BasicHeaders,
          Methods_1r95pbu["get"]["status"]
        >(prefix, PATH2, GET, option).json(),
      /**
       * @returns Discordサーバー取得成功
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_1r95pbu["get"]["resBody"],
          BasicHeaders,
          Methods_1r95pbu["get"]["status"]
        >(prefix, PATH2, GET, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH2}`,
    },
    verify: {
      /**
       * @returns トークンが有効
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_z11b77["get"]["resBody"],
          BasicHeaders,
          Methods_z11b77["get"]["status"]
        >(prefix, PATH3, GET, option).json(),
      /**
       * @returns トークンが有効
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_z11b77["get"]["resBody"],
          BasicHeaders,
          Methods_z11b77["get"]["status"]
        >(prefix, PATH3, GET, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH3}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

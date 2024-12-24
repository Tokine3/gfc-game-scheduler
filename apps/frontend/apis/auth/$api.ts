import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods_i5cbq6 } from "./discord";
import type { Methods as Methods_1a5j3r0 } from "./discord/callback";
import type { Methods as Methods_1r95pbu } from "./servers";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/auth/discord";
  const PATH1 = "/auth/discord/callback";
  const PATH2 = "/auth/servers";
  const GET = "GET";

  return {
    discord: {
      callback: {
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_1a5j3r0["get"]["status"]>(
            prefix,
            PATH1,
            GET,
            option,
          ).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_1a5j3r0["get"]["status"]>(
            prefix,
            PATH1,
            GET,
            option,
          )
            .send()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH1}`,
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
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_1m59apv } from "./server-user";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/servers/me/server-user";
  const GET = "GET";

  return {
    server_user: {
      /**
       * @returns サーバーに参加しているかどうか
       */
      get: (option: {
        query: Methods_1m59apv["get"]["query"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1m59apv["get"]["resBody"],
          BasicHeaders,
          Methods_1m59apv["get"]["status"]
        >(prefix, PATH0, GET, option).json(),
      /**
       * @returns サーバーに参加しているかどうか
       */
      $get: (option: {
        query: Methods_1m59apv["get"]["query"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1m59apv["get"]["resBody"],
          BasicHeaders,
          Methods_1m59apv["get"]["status"]
        >(prefix, PATH0, GET, option)
          .json()
          .then((r) => r.body),
      $path: (
        option?:
          | {
              method?: "get" | undefined;
              query: Methods_1m59apv["get"]["query"];
            }
          | undefined,
      ) =>
        `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

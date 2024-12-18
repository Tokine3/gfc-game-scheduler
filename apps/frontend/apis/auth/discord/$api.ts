import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_icju7x } from "./callback";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/auth/discord";
  const PATH1 = "/auth/discord/callback";
  const GET = "GET";

  return {
    callback: {
      /**
       * @returns Discord認証成功
       */
      get: (option: {
        query: Methods_icju7x["get"]["query"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_icju7x["get"]["resBody"],
          BasicHeaders,
          Methods_icju7x["get"]["status"]
        >(prefix, PATH1, GET, option).json(),
      /**
       * @returns Discord認証成功
       */
      $get: (option: {
        query: Methods_icju7x["get"]["query"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_icju7x["get"]["resBody"],
          BasicHeaders,
          Methods_icju7x["get"]["status"]
        >(prefix, PATH1, GET, option)
          .json()
          .then((r) => r.body),
      $path: (
        option?:
          | {
              method?: "get" | undefined;
              query: Methods_icju7x["get"]["query"];
            }
          | undefined,
      ) =>
        `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
    },
    get: (option?: { config?: T | undefined } | undefined) =>
      fetch<void, BasicHeaders, Methods_by08hd["get"]["status"]>(
        prefix,
        PATH0,
        GET,
        option,
      ).send(),
    $get: (option?: { config?: T | undefined } | undefined) =>
      fetch<void, BasicHeaders, Methods_by08hd["get"]["status"]>(
        prefix,
        PATH0,
        GET,
        option,
      )
        .send()
        .then((r) => r.body),
    $path: () => `${prefix}${PATH0}`,
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

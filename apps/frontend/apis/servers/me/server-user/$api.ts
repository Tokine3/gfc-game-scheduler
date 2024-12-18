import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/servers/me/server-user";
  const GET = "GET";

  return {
    /**
     * @returns サーバーに参加しているかどうか
     */
    get: (option: {
      query: Methods_by08hd["get"]["query"];
      config?: T | undefined;
    }) =>
      fetch<
        Methods_by08hd["get"]["resBody"],
        BasicHeaders,
        Methods_by08hd["get"]["status"]
      >(prefix, PATH0, GET, option).json(),
    /**
     * @returns サーバーに参加しているかどうか
     */
    $get: (option: {
      query: Methods_by08hd["get"]["query"];
      config?: T | undefined;
    }) =>
      fetch<
        Methods_by08hd["get"]["resBody"],
        BasicHeaders,
        Methods_by08hd["get"]["status"]
      >(prefix, PATH0, GET, option)
        .json()
        .then((r) => r.body),
    $path: (
      option?:
        | { method?: "get" | undefined; query: Methods_by08hd["get"]["query"] }
        | undefined,
    ) =>
      `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

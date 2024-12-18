import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods_by08hd } from ".";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/user/login";
  const GET = "GET";

  return {
    /**
     * @returns 最終ログイン時間の更新と自身のデータ取得成功
     */
    get: (option?: { config?: T | undefined } | undefined) =>
      fetch<
        Methods_by08hd["get"]["resBody"],
        BasicHeaders,
        Methods_by08hd["get"]["status"]
      >(prefix, PATH0, GET, option).json(),
    /**
     * @returns 最終ログイン時間の更新と自身のデータ取得成功
     */
    $get: (option?: { config?: T | undefined } | undefined) =>
      fetch<
        Methods_by08hd["get"]["resBody"],
        BasicHeaders,
        Methods_by08hd["get"]["status"]
      >(prefix, PATH0, GET, option)
        .json()
        .then((r) => r.body),
    $path: () => `${prefix}${PATH0}`,
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

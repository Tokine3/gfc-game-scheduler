import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_2yw7dz } from "./_id@string";
import type { Methods as Methods_idk8rz } from "./login";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/user";
  const PATH1 = "/user/login";
  const GET = "GET";
  const DELETE = "DELETE";
  const PATCH = "PATCH";

  return {
    _id: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        /**
         * @returns 指定したユーザの取得成功
         */
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_2yw7dz["get"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["get"]["status"]
          >(prefix, prefix0, GET, option).json(),
        /**
         * @returns 指定したユーザの取得成功
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_2yw7dz["get"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["get"]["status"]
          >(prefix, prefix0, GET, option)
            .json()
            .then((r) => r.body),
        /**
         * @returns ユーザの更新成功
         */
        patch: (option: {
          body: Methods_2yw7dz["patch"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_2yw7dz["patch"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["patch"]["status"]
          >(prefix, prefix0, PATCH, option).json(),
        /**
         * @returns ユーザの更新成功
         */
        $patch: (option: {
          body: Methods_2yw7dz["patch"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_2yw7dz["patch"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["patch"]["status"]
          >(prefix, prefix0, PATCH, option)
            .json()
            .then((r) => r.body),
        delete: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["delete"]["status"]>(
            prefix,
            prefix0,
            DELETE,
            option,
          ).send(),
        $delete: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["delete"]["status"]>(
            prefix,
            prefix0,
            DELETE,
            option,
          )
            .send()
            .then((r) => r.body),
        $path: () => `${prefix}${prefix0}`,
      };
    },
    login: {
      /**
       * @returns 最終ログイン時間の更新と自身のデータ取得成功
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_idk8rz["get"]["resBody"],
          BasicHeaders,
          Methods_idk8rz["get"]["status"]
        >(prefix, PATH1, GET, option).json(),
      /**
       * @returns 最終ログイン時間の更新と自身のデータ取得成功
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<
          Methods_idk8rz["get"]["resBody"],
          BasicHeaders,
          Methods_idk8rz["get"]["status"]
        >(prefix, PATH1, GET, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH1}`,
    },
    /**
     * @returns 検索条件に当てはまるユーザの取得成功
     */
    get: (
      option?:
        | {
            query?: Methods_by08hd["get"]["query"] | undefined;
            config?: T | undefined;
          }
        | undefined,
    ) =>
      fetch<
        Methods_by08hd["get"]["resBody"],
        BasicHeaders,
        Methods_by08hd["get"]["status"]
      >(prefix, PATH0, GET, option).json(),
    /**
     * @returns 検索条件に当てはまるユーザの取得成功
     */
    $get: (
      option?:
        | {
            query?: Methods_by08hd["get"]["query"] | undefined;
            config?: T | undefined;
          }
        | undefined,
    ) =>
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

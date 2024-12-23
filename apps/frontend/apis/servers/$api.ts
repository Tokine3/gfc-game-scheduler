import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_2yw7dz } from "./_id@string";
import type { Methods as Methods_5bhlp1 } from "./fav/_id@string";
import type { Methods as Methods_1458f52 } from "./join";
import type { Methods as Methods_mzl5eq } from "./me/server-user";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/servers";
  const PATH1 = "/servers/fav";
  const PATH2 = "/servers/join";
  const PATH3 = "/servers/me/server-user";
  const GET = "GET";
  const POST = "POST";
  const DELETE = "DELETE";
  const PATCH = "PATCH";

  return {
    _id: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["get"]["status"]>(
            prefix,
            prefix0,
            GET,
            option,
          ).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["get"]["status"]>(
            prefix,
            prefix0,
            GET,
            option,
          )
            .send()
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
    fav: {
      _id: (val1: string) => {
        const prefix1 = `${PATH1}/${val1}`;

        return {
          /**
           * @returns サーバーをお気に入りに追加しました
           */
          patch: (option: {
            body: Methods_5bhlp1["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_5bhlp1["patch"]["resBody"],
              BasicHeaders,
              Methods_5bhlp1["patch"]["status"]
            >(prefix, prefix1, PATCH, option).json(),
          /**
           * @returns サーバーをお気に入りに追加しました
           */
          $patch: (option: {
            body: Methods_5bhlp1["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_5bhlp1["patch"]["resBody"],
              BasicHeaders,
              Methods_5bhlp1["patch"]["status"]
            >(prefix, prefix1, PATCH, option)
              .json()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
    },
    join: {
      /**
       * @returns サーバーに参加しました
       */
      post: (option: {
        body: Methods_1458f52["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1458f52["post"]["resBody"],
          BasicHeaders,
          Methods_1458f52["post"]["status"]
        >(prefix, PATH2, POST, option).json(),
      /**
       * @returns サーバーに参加しました
       */
      $post: (option: {
        body: Methods_1458f52["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1458f52["post"]["resBody"],
          BasicHeaders,
          Methods_1458f52["post"]["status"]
        >(prefix, PATH2, POST, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH2}`,
    },
    me: {
      server_user: {
        /**
         * @returns サーバーに参加しているかどうか
         */
        get: (option: {
          query: Methods_mzl5eq["get"]["query"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_mzl5eq["get"]["resBody"],
            BasicHeaders,
            Methods_mzl5eq["get"]["status"]
          >(prefix, PATH3, GET, option).json(),
        /**
         * @returns サーバーに参加しているかどうか
         */
        $get: (option: {
          query: Methods_mzl5eq["get"]["query"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_mzl5eq["get"]["resBody"],
            BasicHeaders,
            Methods_mzl5eq["get"]["status"]
          >(prefix, PATH3, GET, option)
            .json()
            .then((r) => r.body),
        $path: (
          option?:
            | {
                method?: "get" | undefined;
                query: Methods_mzl5eq["get"]["query"];
              }
            | undefined,
        ) =>
          `${prefix}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
      },
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

import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_5bhlp1 } from "./fav/_id@string";
import type { Methods as Methods_1458f52 } from "./join";
import type { Methods as Methods_mzl5eq } from "./me/server-user";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/servers/fav";
  const PATH1 = "/servers/join";
  const PATH2 = "/servers/me/server-user";
  const GET = "GET";
  const POST = "POST";
  const PATCH = "PATCH";

  return {
    fav: {
      _id: (val1: string) => {
        const prefix1 = `${PATH0}/${val1}`;

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
        >(prefix, PATH1, POST, option).json(),
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
        >(prefix, PATH1, POST, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH1}`,
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
          >(prefix, PATH2, GET, option).json(),
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
          >(prefix, PATH2, GET, option)
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
          `${prefix}${PATH2}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

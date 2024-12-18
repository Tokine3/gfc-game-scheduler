import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_nxcu13 } from "./auth/discord";
import type { Methods as Methods_12zp75v } from "./auth/discord/callback";
import type { Methods as Methods_19zxzpn } from "./auth/servers";
import type { Methods as Methods_10yceks } from "./auth/verify";
import type { Methods as Methods_1nhtobh } from "./calendars";
import type { Methods as Methods_14m84y3 } from "./calendars/_id@string";
import type { Methods as Methods_lxn7j8 } from "./schedules";
import type { Methods as Methods_11i9wjc } from "./schedules/_id@string";
import type { Methods as Methods_nxm3d5 } from "./schedules/personal";
import type { Methods as Methods_hqdgs } from "./schedules/public";
import type { Methods as Methods_1r95pbu } from "./servers";
import type { Methods as Methods_11eh2yq } from "./servers/_id@string";
import type { Methods as Methods_dvs1gv } from "./servers/join";
import type { Methods as Methods_m3tpez } from "./servers/me/server-user";
import type { Methods as Methods_tli9od } from "./user";
import type { Methods as Methods_13i5w2z } from "./user/_id@string";
import type { Methods as Methods_1904ovn } from "./user/login";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/auth/discord";
  const PATH1 = "/auth/discord/callback";
  const PATH2 = "/auth/servers";
  const PATH3 = "/auth/verify";
  const PATH4 = "/calendars";
  const PATH5 = "/schedules";
  const PATH6 = "/schedules/personal";
  const PATH7 = "/schedules/public";
  const PATH8 = "/servers";
  const PATH9 = "/servers/join";
  const PATH10 = "/servers/me/server-user";
  const PATH11 = "/user";
  const PATH12 = "/user/login";
  const GET = "GET";
  const POST = "POST";
  const DELETE = "DELETE";
  const PATCH = "PATCH";

  return {
    auth: {
      discord: {
        callback: {
          /**
           * @returns Discord認証成功
           */
          get: (option: {
            query: Methods_12zp75v["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_12zp75v["get"]["resBody"],
              BasicHeaders,
              Methods_12zp75v["get"]["status"]
            >(prefix, PATH1, GET, option).json(),
          /**
           * @returns Discord認証成功
           */
          $get: (option: {
            query: Methods_12zp75v["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_12zp75v["get"]["resBody"],
              BasicHeaders,
              Methods_12zp75v["get"]["status"]
            >(prefix, PATH1, GET, option)
              .json()
              .then((r) => r.body),
          $path: (
            option?:
              | {
                  method?: "get" | undefined;
                  query: Methods_12zp75v["get"]["query"];
                }
              | undefined,
          ) =>
            `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
        },
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_nxcu13["get"]["status"]>(
            prefix,
            PATH0,
            GET,
            option,
          ).send(),
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<void, BasicHeaders, Methods_nxcu13["get"]["status"]>(
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
            Methods_19zxzpn["get"]["resBody"],
            BasicHeaders,
            Methods_19zxzpn["get"]["status"]
          >(prefix, PATH2, GET, option).json(),
        /**
         * @returns Discordサーバー取得成功
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_19zxzpn["get"]["resBody"],
            BasicHeaders,
            Methods_19zxzpn["get"]["status"]
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
            Methods_10yceks["get"]["resBody"],
            BasicHeaders,
            Methods_10yceks["get"]["status"]
          >(prefix, PATH3, GET, option).json(),
        /**
         * @returns トークンが有効
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_10yceks["get"]["resBody"],
            BasicHeaders,
            Methods_10yceks["get"]["status"]
          >(prefix, PATH3, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH3}`,
      },
    },
    calendars: {
      _id: (val1: string) => {
        const prefix1 = `${PATH4}/${val1}`;

        return {
          /**
           * @returns カレンダー取得成功
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_14m84y3["get"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["get"]["status"]
            >(prefix, prefix1, GET, option).json(),
          /**
           * @returns カレンダー取得成功
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_14m84y3["get"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["get"]["status"]
            >(prefix, prefix1, GET, option)
              .json()
              .then((r) => r.body),
          patch: (option: {
            body: Methods_14m84y3["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_14m84y3["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            ).send(),
          $patch: (option: {
            body: Methods_14m84y3["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_14m84y3["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            )
              .send()
              .then((r) => r.body),
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_14m84y3["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            ).send(),
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_14m84y3["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * @returns カレンダー作成成功
       */
      post: (option: {
        body: Methods_1nhtobh["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1nhtobh["post"]["resBody"],
          BasicHeaders,
          Methods_1nhtobh["post"]["status"]
        >(prefix, PATH4, POST, option).json(),
      /**
       * @returns カレンダー作成成功
       */
      $post: (option: {
        body: Methods_1nhtobh["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_1nhtobh["post"]["resBody"],
          BasicHeaders,
          Methods_1nhtobh["post"]["status"]
        >(prefix, PATH4, POST, option)
          .json()
          .then((r) => r.body),
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1nhtobh["get"]["status"]>(
          prefix,
          PATH4,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1nhtobh["get"]["status"]>(
          prefix,
          PATH4,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH4}`,
    },
    schedules: {
      _id: (val1: string) => {
        const prefix1 = `${PATH5}/${val1}`;

        return {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["get"]["status"]>(
              prefix,
              prefix1,
              GET,
              option,
            ).send(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["get"]["status"]>(
              prefix,
              prefix1,
              GET,
              option,
            )
              .send()
              .then((r) => r.body),
          patch: (option: {
            body: Methods_11i9wjc["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            ).send(),
          $patch: (option: {
            body: Methods_11i9wjc["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            )
              .send()
              .then((r) => r.body),
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            ).send(),
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11i9wjc["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      personal: {
        /**
         * @param option.body - 個人スケジュール作成リクエスト
         * @returns 個人スケジュール作成成功
         */
        post: (option: {
          body: Methods_nxm3d5["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_nxm3d5["post"]["resBody"],
            BasicHeaders,
            Methods_nxm3d5["post"]["status"]
          >(prefix, PATH6, POST, option).json(),
        /**
         * @param option.body - 個人スケジュール作成リクエスト
         * @returns 個人スケジュール作成成功
         */
        $post: (option: {
          body: Methods_nxm3d5["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_nxm3d5["post"]["resBody"],
            BasicHeaders,
            Methods_nxm3d5["post"]["status"]
          >(prefix, PATH6, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH6}`,
      },
      public: {
        post: (option: {
          body: Methods_hqdgs["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods_hqdgs["post"]["status"]>(
            prefix,
            PATH7,
            POST,
            option,
          ).send(),
        $post: (option: {
          body: Methods_hqdgs["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods_hqdgs["post"]["status"]>(
            prefix,
            PATH7,
            POST,
            option,
          )
            .send()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH7}`,
      },
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_lxn7j8["get"]["status"]>(
          prefix,
          PATH5,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_lxn7j8["get"]["status"]>(
          prefix,
          PATH5,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH5}`,
    },
    servers: {
      _id: (val1: string) => {
        const prefix1 = `${PATH8}/${val1}`;

        return {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["get"]["status"]>(
              prefix,
              prefix1,
              GET,
              option,
            ).send(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["get"]["status"]>(
              prefix,
              prefix1,
              GET,
              option,
            )
              .send()
              .then((r) => r.body),
          patch: (option: {
            body: Methods_11eh2yq["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            ).send(),
          $patch: (option: {
            body: Methods_11eh2yq["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["patch"]["status"]>(
              prefix,
              prefix1,
              PATCH,
              option,
            )
              .send()
              .then((r) => r.body),
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            ).send(),
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_11eh2yq["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      join: {
        /**
         * @returns サーバーに参加しました
         */
        post: (option: {
          body: Methods_dvs1gv["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_dvs1gv["post"]["resBody"],
            BasicHeaders,
            Methods_dvs1gv["post"]["status"]
          >(prefix, PATH9, POST, option).json(),
        /**
         * @returns サーバーに参加しました
         */
        $post: (option: {
          body: Methods_dvs1gv["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods_dvs1gv["post"]["resBody"],
            BasicHeaders,
            Methods_dvs1gv["post"]["status"]
          >(prefix, PATH9, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH9}`,
      },
      me: {
        server_user: {
          /**
           * @returns サーバーに参加しているかどうか
           */
          get: (option: {
            query: Methods_m3tpez["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_m3tpez["get"]["resBody"],
              BasicHeaders,
              Methods_m3tpez["get"]["status"]
            >(prefix, PATH10, GET, option).json(),
          /**
           * @returns サーバーに参加しているかどうか
           */
          $get: (option: {
            query: Methods_m3tpez["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_m3tpez["get"]["resBody"],
              BasicHeaders,
              Methods_m3tpez["get"]["status"]
            >(prefix, PATH10, GET, option)
              .json()
              .then((r) => r.body),
          $path: (
            option?:
              | {
                  method?: "get" | undefined;
                  query: Methods_m3tpez["get"]["query"];
                }
              | undefined,
          ) =>
            `${prefix}${PATH10}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
        },
      },
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1r95pbu["get"]["status"]>(
          prefix,
          PATH8,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1r95pbu["get"]["status"]>(
          prefix,
          PATH8,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH8}`,
    },
    user: {
      _id: (val1: string) => {
        const prefix1 = `${PATH11}/${val1}`;

        return {
          /**
           * @returns 指定したユーザの取得成功
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_13i5w2z["get"]["resBody"],
              BasicHeaders,
              Methods_13i5w2z["get"]["status"]
            >(prefix, prefix1, GET, option).json(),
          /**
           * @returns 指定したユーザの取得成功
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<
              Methods_13i5w2z["get"]["resBody"],
              BasicHeaders,
              Methods_13i5w2z["get"]["status"]
            >(prefix, prefix1, GET, option)
              .json()
              .then((r) => r.body),
          /**
           * @returns ユーザの更新成功
           */
          patch: (option: {
            body: Methods_13i5w2z["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_13i5w2z["patch"]["resBody"],
              BasicHeaders,
              Methods_13i5w2z["patch"]["status"]
            >(prefix, prefix1, PATCH, option).json(),
          /**
           * @returns ユーザの更新成功
           */
          $patch: (option: {
            body: Methods_13i5w2z["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_13i5w2z["patch"]["resBody"],
              BasicHeaders,
              Methods_13i5w2z["patch"]["status"]
            >(prefix, prefix1, PATCH, option)
              .json()
              .then((r) => r.body),
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_13i5w2z["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            ).send(),
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_13i5w2z["delete"]["status"]>(
              prefix,
              prefix1,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      login: {
        /**
         * @returns 最終ログイン時間の更新と自身のデータ取得成功
         */
        get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_1904ovn["get"]["resBody"],
            BasicHeaders,
            Methods_1904ovn["get"]["status"]
          >(prefix, PATH12, GET, option).json(),
        /**
         * @returns 最終ログイン時間の更新と自身のデータ取得成功
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_1904ovn["get"]["resBody"],
            BasicHeaders,
            Methods_1904ovn["get"]["status"]
          >(prefix, PATH12, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH12}`,
      },
      /**
       * @returns 検索条件に当てはまるユーザの取得成功
       */
      get: (
        option?:
          | {
              query?: Methods_tli9od["get"]["query"] | undefined;
              config?: T | undefined;
            }
          | undefined,
      ) =>
        fetch<
          Methods_tli9od["get"]["resBody"],
          BasicHeaders,
          Methods_tli9od["get"]["status"]
        >(prefix, PATH11, GET, option).json(),
      /**
       * @returns 検索条件に当てはまるユーザの取得成功
       */
      $get: (
        option?:
          | {
              query?: Methods_tli9od["get"]["query"] | undefined;
              config?: T | undefined;
            }
          | undefined,
      ) =>
        fetch<
          Methods_tli9od["get"]["resBody"],
          BasicHeaders,
          Methods_tli9od["get"]["status"]
        >(prefix, PATH11, GET, option)
          .json()
          .then((r) => r.body),
      $path: (
        option?:
          | {
              method?: "get" | undefined;
              query: Methods_tli9od["get"]["query"];
            }
          | undefined,
      ) =>
        `${prefix}${PATH11}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

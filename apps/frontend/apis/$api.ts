import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_nxcu13 } from "./auth/discord";
import type { Methods as Methods_12zp75v } from "./auth/discord/callback";
import type { Methods as Methods_19zxzpn } from "./auth/servers";
import type { Methods as Methods_1nhtobh } from "./calendars";
import type { Methods as Methods_14m84y3 } from "./calendars/_id@string";
import type { Methods as Methods_18qsrps } from "./health";
import type { Methods as Methods_lxn7j8 } from "./schedules";
import type { Methods as Methods_xb80kx } from "./schedules/_calendarId@string/all-schedules";
import type { Methods as Methods_bn7aym } from "./schedules/_calendarId@string/me/personal";
import type { Methods as Methods_zxijjv } from "./schedules/_calendarId@string/personal";
import type { Methods as Methods_1ti6346 } from "./schedules/_calendarId@string/public";
import type { Methods as Methods_11i9wjc } from "./schedules/_id@string";
import type { Methods as Methods_1r95pbu } from "./servers";
import type { Methods as Methods_11eh2yq } from "./servers/_id@string";
import type { Methods as Methods_fh3uxg } from "./servers/fav/_id@string";
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
  const PATH3 = "/calendars";
  const PATH4 = "/health";
  const PATH5 = "/schedules";
  const PATH6 = "/all-schedules";
  const PATH7 = "/me/personal";
  const PATH8 = "/personal";
  const PATH9 = "/public";
  const PATH10 = "/servers";
  const PATH11 = "/servers/fav";
  const PATH12 = "/servers/join";
  const PATH13 = "/servers/me/server-user";
  const PATH14 = "/user";
  const PATH15 = "/user/login";
  const GET = "GET";
  const POST = "POST";
  const DELETE = "DELETE";
  const PATCH = "PATCH";

  return {
    auth: {
      discord: {
        callback: {
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_12zp75v["get"]["status"]>(
              prefix,
              PATH1,
              GET,
              option,
            ).send(),
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_12zp75v["get"]["status"]>(
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
    },
    calendars: {
      _id: (val1: string) => {
        const prefix1 = `${PATH3}/${val1}`;

        return {
          /**
           * @returns カレンダー取得成功
           */
          get: (
            option?:
              | {
                  query?: Methods_14m84y3["get"]["query"] | undefined;
                  config?: T | undefined;
                }
              | undefined,
          ) =>
            fetch<
              Methods_14m84y3["get"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["get"]["status"]
            >(prefix, prefix1, GET, option).json(),
          /**
           * @returns カレンダー取得成功
           */
          $get: (
            option?:
              | {
                  query?: Methods_14m84y3["get"]["query"] | undefined;
                  config?: T | undefined;
                }
              | undefined,
          ) =>
            fetch<
              Methods_14m84y3["get"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["get"]["status"]
            >(prefix, prefix1, GET, option)
              .json()
              .then((r) => r.body),
          /**
           * @returns カレンダー更新成功
           */
          patch: (option: {
            body: Methods_14m84y3["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_14m84y3["patch"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["patch"]["status"]
            >(prefix, prefix1, PATCH, option).json(),
          /**
           * @returns カレンダー更新成功
           */
          $patch: (option: {
            body: Methods_14m84y3["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_14m84y3["patch"]["resBody"],
              BasicHeaders,
              Methods_14m84y3["patch"]["status"]
            >(prefix, prefix1, PATCH, option)
              .json()
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
          $path: (
            option?:
              | {
                  method?: "get" | undefined;
                  query: Methods_14m84y3["get"]["query"];
                }
              | undefined,
          ) =>
            `${prefix}${prefix1}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
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
        >(prefix, PATH3, POST, option).json(),
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
        >(prefix, PATH3, POST, option)
          .json()
          .then((r) => r.body),
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1nhtobh["get"]["status"]>(
          prefix,
          PATH3,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1nhtobh["get"]["status"]>(
          prefix,
          PATH3,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH3}`,
    },
    health: {
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_18qsrps["get"]["status"]>(
          prefix,
          PATH4,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_18qsrps["get"]["status"]>(
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
      _calendarId: (val1: string) => {
        const prefix1 = `${PATH5}/${val1}`;

        return {
          all_schedules: {
            /**
             * @returns ユーザーのスケジュール取得成功
             */
            get: (option: {
              query: Methods_xb80kx["get"]["query"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_xb80kx["get"]["resBody"],
                BasicHeaders,
                Methods_xb80kx["get"]["status"]
              >(prefix, `${prefix1}${PATH6}`, GET, option).json(),
            /**
             * @returns ユーザーのスケジュール取得成功
             */
            $get: (option: {
              query: Methods_xb80kx["get"]["query"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_xb80kx["get"]["resBody"],
                BasicHeaders,
                Methods_xb80kx["get"]["status"]
              >(prefix, `${prefix1}${PATH6}`, GET, option)
                .json()
                .then((r) => r.body),
            $path: (
              option?:
                | {
                    method?: "get" | undefined;
                    query: Methods_xb80kx["get"]["query"];
                  }
                | undefined,
            ) =>
              `${prefix}${prefix1}${PATH6}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
          },
          me: {
            personal: {
              /**
               * @returns ユーザーの個人スケジュール取得成功
               */
              get: (
                option?:
                  | {
                      query?: Methods_bn7aym["get"]["query"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined,
              ) =>
                fetch<
                  Methods_bn7aym["get"]["resBody"],
                  BasicHeaders,
                  Methods_bn7aym["get"]["status"]
                >(prefix, `${prefix1}${PATH7}`, GET, option).json(),
              /**
               * @returns ユーザーの個人スケジュール取得成功
               */
              $get: (
                option?:
                  | {
                      query?: Methods_bn7aym["get"]["query"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined,
              ) =>
                fetch<
                  Methods_bn7aym["get"]["resBody"],
                  BasicHeaders,
                  Methods_bn7aym["get"]["status"]
                >(prefix, `${prefix1}${PATH7}`, GET, option)
                  .json()
                  .then((r) => r.body),
              $path: (
                option?:
                  | {
                      method?: "get" | undefined;
                      query: Methods_bn7aym["get"]["query"];
                    }
                  | undefined,
              ) =>
                `${prefix}${prefix1}${PATH7}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
            },
          },
          personal: {
            /**
             * 指定された期間の個人スケジュールを一括で作成・更新します
             * @param option.body - 個人スケジュール作成リクエスト
             * @returns 個人スケジュール作成成功
             */
            post: (option: {
              body: Methods_zxijjv["post"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_zxijjv["post"]["resBody"],
                BasicHeaders,
                Methods_zxijjv["post"]["status"]
              >(prefix, `${prefix1}${PATH8}`, POST, option).json(),
            /**
             * 指定された期間の個人スケジュールを一括で作成・更新します
             * @param option.body - 個人スケジュール作成リクエスト
             * @returns 個人スケジュール作成成功
             */
            $post: (option: {
              body: Methods_zxijjv["post"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_zxijjv["post"]["resBody"],
                BasicHeaders,
                Methods_zxijjv["post"]["status"]
              >(prefix, `${prefix1}${PATH8}`, POST, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix1}${PATH8}`,
          },
          public: {
            /**
             * @param option.body - 公開スケジュール作成リクエスト
             */
            post: (option: {
              body: Methods_1ti6346["post"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<void, BasicHeaders, Methods_1ti6346["post"]["status"]>(
                prefix,
                `${prefix1}${PATH9}`,
                POST,
                option,
              ).send(),
            /**
             * @param option.body - 公開スケジュール作成リクエスト
             */
            $post: (option: {
              body: Methods_1ti6346["post"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<void, BasicHeaders, Methods_1ti6346["post"]["status"]>(
                prefix,
                `${prefix1}${PATH9}`,
                POST,
                option,
              )
                .send()
                .then((r) => r.body),
            /**
             * @returns 公開スケジュール取得成功
             */
            get: (
              option?:
                | {
                    query?: Methods_1ti6346["get"]["query"] | undefined;
                    config?: T | undefined;
                  }
                | undefined,
            ) =>
              fetch<
                Methods_1ti6346["get"]["resBody"],
                BasicHeaders,
                Methods_1ti6346["get"]["status"]
              >(prefix, `${prefix1}${PATH9}`, GET, option).json(),
            /**
             * @returns 公開スケジュール取得成功
             */
            $get: (
              option?:
                | {
                    query?: Methods_1ti6346["get"]["query"] | undefined;
                    config?: T | undefined;
                  }
                | undefined,
            ) =>
              fetch<
                Methods_1ti6346["get"]["resBody"],
                BasicHeaders,
                Methods_1ti6346["get"]["status"]
              >(prefix, `${prefix1}${PATH9}`, GET, option)
                .json()
                .then((r) => r.body),
            $path: (
              option?:
                | {
                    method?: "get" | undefined;
                    query: Methods_1ti6346["get"]["query"];
                  }
                | undefined,
            ) =>
              `${prefix}${prefix1}${PATH9}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
          },
        };
      },
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
        const prefix1 = `${PATH10}/${val1}`;

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
      fav: {
        _id: (val2: string) => {
          const prefix2 = `${PATH11}/${val2}`;

          return {
            /**
             * @returns サーバーをお気に入りに追加しました
             */
            patch: (option: {
              body: Methods_fh3uxg["patch"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_fh3uxg["patch"]["resBody"],
                BasicHeaders,
                Methods_fh3uxg["patch"]["status"]
              >(prefix, prefix2, PATCH, option).json(),
            /**
             * @returns サーバーをお気に入りに追加しました
             */
            $patch: (option: {
              body: Methods_fh3uxg["patch"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_fh3uxg["patch"]["resBody"],
                BasicHeaders,
                Methods_fh3uxg["patch"]["status"]
              >(prefix, prefix2, PATCH, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
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
          >(prefix, PATH12, POST, option).json(),
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
          >(prefix, PATH12, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH12}`,
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
            >(prefix, PATH13, GET, option).json(),
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
            >(prefix, PATH13, GET, option)
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
            `${prefix}${PATH13}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
        },
      },
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1r95pbu["get"]["status"]>(
          prefix,
          PATH10,
          GET,
          option,
        ).send(),
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<void, BasicHeaders, Methods_1r95pbu["get"]["status"]>(
          prefix,
          PATH10,
          GET,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH10}`,
    },
    user: {
      _id: (val1: string) => {
        const prefix1 = `${PATH14}/${val1}`;

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
          >(prefix, PATH15, GET, option).json(),
        /**
         * @returns 最終ログイン時間の更新と自身のデータ取得成功
         */
        $get: (option?: { config?: T | undefined } | undefined) =>
          fetch<
            Methods_1904ovn["get"]["resBody"],
            BasicHeaders,
            Methods_1904ovn["get"]["status"]
          >(prefix, PATH15, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH15}`,
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
        >(prefix, PATH14, GET, option).json(),
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
        >(prefix, PATH14, GET, option)
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
        `${prefix}${PATH14}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

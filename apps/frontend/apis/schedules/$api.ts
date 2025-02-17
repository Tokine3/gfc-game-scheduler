import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_1p1r0xa } from "./_calendarId@string/all-schedules";
import type { Methods as Methods_x7hmud } from "./_calendarId@string/me/personal";
import type { Methods as Methods_1tduqze } from "./_calendarId@string/personal";
import type { Methods as Methods_7up0tv } from "./_calendarId@string/public";
import type { Methods as Methods_mdoht4 } from "./_id@string/personal";
import type { Methods as Methods_kq0c5l } from "./_id@string/public";
import type { Methods as Methods_1cldan9 } from "./_id@string/public/reaction";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/schedules";
  const PATH1 = "/all-schedules";
  const PATH2 = "/me/personal";
  const PATH3 = "/personal";
  const PATH4 = "/public";
  const PATH5 = "/public/reaction";
  const GET = "GET";
  const POST = "POST";
  const DELETE = "DELETE";
  const PATCH = "PATCH";

  return {
    _calendarId: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        all_schedules: {
          /**
           * @returns ユーザーのスケジュール取得成功
           */
          get: (option: {
            query: Methods_1p1r0xa["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_1p1r0xa["get"]["resBody"],
              BasicHeaders,
              Methods_1p1r0xa["get"]["status"]
            >(prefix, `${prefix0}${PATH1}`, GET, option).json(),
          /**
           * @returns ユーザーのスケジュール取得成功
           */
          $get: (option: {
            query: Methods_1p1r0xa["get"]["query"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_1p1r0xa["get"]["resBody"],
              BasicHeaders,
              Methods_1p1r0xa["get"]["status"]
            >(prefix, `${prefix0}${PATH1}`, GET, option)
              .json()
              .then((r) => r.body),
          $path: (
            option?:
              | {
                  method?: "get" | undefined;
                  query: Methods_1p1r0xa["get"]["query"];
                }
              | undefined,
          ) =>
            `${prefix}${prefix0}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
        },
        me: {
          personal: {
            /**
             * @returns ユーザーの個人スケジュール取得成功
             */
            get: (
              option?:
                | {
                    query?: Methods_x7hmud["get"]["query"] | undefined;
                    config?: T | undefined;
                  }
                | undefined,
            ) =>
              fetch<
                Methods_x7hmud["get"]["resBody"],
                BasicHeaders,
                Methods_x7hmud["get"]["status"]
              >(prefix, `${prefix0}${PATH2}`, GET, option).json(),
            /**
             * @returns ユーザーの個人スケジュール取得成功
             */
            $get: (
              option?:
                | {
                    query?: Methods_x7hmud["get"]["query"] | undefined;
                    config?: T | undefined;
                  }
                | undefined,
            ) =>
              fetch<
                Methods_x7hmud["get"]["resBody"],
                BasicHeaders,
                Methods_x7hmud["get"]["status"]
              >(prefix, `${prefix0}${PATH2}`, GET, option)
                .json()
                .then((r) => r.body),
            $path: (
              option?:
                | {
                    method?: "get" | undefined;
                    query: Methods_x7hmud["get"]["query"];
                  }
                | undefined,
            ) =>
              `${prefix}${prefix0}${PATH2}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
          },
        },
        personal: {
          /**
           * 指定された期間の個人スケジュールを一括で作成・更新します
           * @param option.body - 個人スケジュール作成リクエスト
           * @returns 個人スケジュール作成成功
           */
          post: (option: {
            body: Methods_1tduqze["post"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_1tduqze["post"]["resBody"],
              BasicHeaders,
              Methods_1tduqze["post"]["status"]
            >(prefix, `${prefix0}${PATH3}`, POST, option).json(),
          /**
           * 指定された期間の個人スケジュールを一括で作成・更新します
           * @param option.body - 個人スケジュール作成リクエスト
           * @returns 個人スケジュール作成成功
           */
          $post: (option: {
            body: Methods_1tduqze["post"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_1tduqze["post"]["resBody"],
              BasicHeaders,
              Methods_1tduqze["post"]["status"]
            >(prefix, `${prefix0}${PATH3}`, POST, option)
              .json()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix0}${PATH3}`,
        },
        public: {
          /**
           * @param option.body - 公開スケジュール作成リクエスト
           */
          post: (option: {
            body: Methods_7up0tv["post"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_7up0tv["post"]["status"]>(
              prefix,
              `${prefix0}${PATH4}`,
              POST,
              option,
            ).send(),
          /**
           * @param option.body - 公開スケジュール作成リクエスト
           */
          $post: (option: {
            body: Methods_7up0tv["post"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_7up0tv["post"]["status"]>(
              prefix,
              `${prefix0}${PATH4}`,
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
                  query?: Methods_7up0tv["get"]["query"] | undefined;
                  config?: T | undefined;
                }
              | undefined,
          ) =>
            fetch<
              Methods_7up0tv["get"]["resBody"],
              BasicHeaders,
              Methods_7up0tv["get"]["status"]
            >(prefix, `${prefix0}${PATH4}`, GET, option).json(),
          /**
           * @returns 公開スケジュール取得成功
           */
          $get: (
            option?:
              | {
                  query?: Methods_7up0tv["get"]["query"] | undefined;
                  config?: T | undefined;
                }
              | undefined,
          ) =>
            fetch<
              Methods_7up0tv["get"]["resBody"],
              BasicHeaders,
              Methods_7up0tv["get"]["status"]
            >(prefix, `${prefix0}${PATH4}`, GET, option)
              .json()
              .then((r) => r.body),
          $path: (
            option?:
              | {
                  method?: "get" | undefined;
                  query: Methods_7up0tv["get"]["query"];
                }
              | undefined,
          ) =>
            `${prefix}${prefix0}${PATH4}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
        },
      };
    },
    _id: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        personal: {
          /**
           * @param option.body - 個人スケジュール削除リクエスト
           */
          delete: (option: {
            body: Methods_mdoht4["delete"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_mdoht4["delete"]["status"]>(
              prefix,
              `${prefix0}${PATH3}`,
              DELETE,
              option,
            ).send(),
          /**
           * @param option.body - 個人スケジュール削除リクエスト
           */
          $delete: (option: {
            body: Methods_mdoht4["delete"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_mdoht4["delete"]["status"]>(
              prefix,
              `${prefix0}${PATH3}`,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix0}${PATH3}`,
        },
        public: {
          reaction: {
            /**
             * @param option.body - 公開スケジュール参加者更新リクエスト
             * @returns 公開スケジュール参加者更新成功
             */
            patch: (option: {
              body: Methods_1cldan9["patch"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_1cldan9["patch"]["resBody"],
                BasicHeaders,
                Methods_1cldan9["patch"]["status"]
              >(prefix, `${prefix0}${PATH5}`, PATCH, option).json(),
            /**
             * @param option.body - 公開スケジュール参加者更新リクエスト
             * @returns 公開スケジュール参加者更新成功
             */
            $patch: (option: {
              body: Methods_1cldan9["patch"]["reqBody"];
              config?: T | undefined;
            }) =>
              fetch<
                Methods_1cldan9["patch"]["resBody"],
                BasicHeaders,
                Methods_1cldan9["patch"]["status"]
              >(prefix, `${prefix0}${PATH5}`, PATCH, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix0}${PATH5}`,
          },
          /**
           * @param option.body - 公開スケジュール更新リクエスト
           * @returns 公開スケジュール更新成功
           */
          patch: (option: {
            body: Methods_kq0c5l["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_kq0c5l["patch"]["resBody"],
              BasicHeaders,
              Methods_kq0c5l["patch"]["status"]
            >(prefix, `${prefix0}${PATH4}`, PATCH, option).json(),
          /**
           * @param option.body - 公開スケジュール更新リクエスト
           * @returns 公開スケジュール更新成功
           */
          $patch: (option: {
            body: Methods_kq0c5l["patch"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<
              Methods_kq0c5l["patch"]["resBody"],
              BasicHeaders,
              Methods_kq0c5l["patch"]["status"]
            >(prefix, `${prefix0}${PATH4}`, PATCH, option)
              .json()
              .then((r) => r.body),
          /**
           * @param option.body - 公開スケジュール削除リクエスト
           */
          delete: (option: {
            body: Methods_kq0c5l["delete"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_kq0c5l["delete"]["status"]>(
              prefix,
              `${prefix0}${PATH4}`,
              DELETE,
              option,
            ).send(),
          /**
           * @param option.body - 公開スケジュール削除リクエスト
           */
          $delete: (option: {
            body: Methods_kq0c5l["delete"]["reqBody"];
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods_kq0c5l["delete"]["status"]>(
              prefix,
              `${prefix0}${PATH4}`,
              DELETE,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix0}${PATH4}`,
        },
      };
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

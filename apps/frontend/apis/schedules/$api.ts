import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_1p1r0xa } from "./_calendarId@string/all-schedules";
import type { Methods as Methods_1tduqze } from "./_calendarId@string/personal";
import type { Methods as Methods_7up0tv } from "./_calendarId@string/public";
import type { Methods as Methods_2yw7dz } from "./_id@string";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/schedules";
  const PATH1 = "/all-schedules";
  const PATH2 = "/personal";
  const PATH3 = "/public";
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
        personal: {
          /**
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
            >(prefix, `${prefix0}${PATH2}`, POST, option).json(),
          /**
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
            >(prefix, `${prefix0}${PATH2}`, POST, option)
              .json()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix0}${PATH2}`,
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
              `${prefix0}${PATH3}`,
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
              `${prefix0}${PATH3}`,
              POST,
              option,
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${prefix0}${PATH3}`,
        },
      };
    },
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
        patch: (option: {
          body: Methods_2yw7dz["patch"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["patch"]["status"]>(
            prefix,
            prefix0,
            PATCH,
            option,
          ).send(),
        $patch: (option: {
          body: Methods_2yw7dz["patch"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods_2yw7dz["patch"]["status"]>(
            prefix,
            prefix0,
            PATCH,
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

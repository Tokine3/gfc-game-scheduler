import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_2yw7dz } from "./_id@string";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/calendars";
  const GET = "GET";
  const POST = "POST";
  const PATCH = "PATCH";

  return {
    _id: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        /**
         * @returns カレンダー取得成功
         */
        get: (
          option?:
            | {
                query?: Methods_2yw7dz["get"]["query"] | undefined;
                config?: T | undefined;
              }
            | undefined,
        ) =>
          fetch<
            Methods_2yw7dz["get"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["get"]["status"]
          >(prefix, prefix0, GET, option).json(),
        /**
         * @returns カレンダー取得成功
         */
        $get: (
          option?:
            | {
                query?: Methods_2yw7dz["get"]["query"] | undefined;
                config?: T | undefined;
              }
            | undefined,
        ) =>
          fetch<
            Methods_2yw7dz["get"]["resBody"],
            BasicHeaders,
            Methods_2yw7dz["get"]["status"]
          >(prefix, prefix0, GET, option)
            .json()
            .then((r) => r.body),
        /**
         * @returns カレンダー更新成功
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
         * @returns カレンダー更新成功
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
        $path: (
          option?:
            | {
                method?: "get" | undefined;
                query: Methods_2yw7dz["get"]["query"];
              }
            | undefined,
        ) =>
          `${prefix}${prefix0}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
      };
    },
    /**
     * @returns カレンダー作成成功
     */
    post: (option: {
      body: Methods_by08hd["post"]["reqBody"];
      config?: T | undefined;
    }) =>
      fetch<
        Methods_by08hd["post"]["resBody"],
        BasicHeaders,
        Methods_by08hd["post"]["status"]
      >(prefix, PATH0, POST, option).json(),
    /**
     * @returns カレンダー作成成功
     */
    $post: (option: {
      body: Methods_by08hd["post"]["reqBody"];
      config?: T | undefined;
    }) =>
      fetch<
        Methods_by08hd["post"]["resBody"],
        BasicHeaders,
        Methods_by08hd["post"]["status"]
      >(prefix, PATH0, POST, option)
        .json()
        .then((r) => r.body),
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

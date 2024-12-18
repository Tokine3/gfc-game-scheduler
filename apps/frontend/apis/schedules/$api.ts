import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods_by08hd } from ".";
import type { Methods as Methods_2yw7dz } from "./_id@string";
import type { Methods as Methods_176ld2y } from "./personal";
import type { Methods as Methods_16xdnf7 } from "./public";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/schedules";
  const PATH1 = "/schedules/personal";
  const PATH2 = "/schedules/public";
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
    personal: {
      /**
       * @param option.body - 個人スケジュール作成リクエスト
       * @returns 個人スケジュール作成成功
       */
      post: (option: {
        body: Methods_176ld2y["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_176ld2y["post"]["resBody"],
          BasicHeaders,
          Methods_176ld2y["post"]["status"]
        >(prefix, PATH1, POST, option).json(),
      /**
       * @param option.body - 個人スケジュール作成リクエスト
       * @returns 個人スケジュール作成成功
       */
      $post: (option: {
        body: Methods_176ld2y["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<
          Methods_176ld2y["post"]["resBody"],
          BasicHeaders,
          Methods_176ld2y["post"]["status"]
        >(prefix, PATH1, POST, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH1}`,
    },
    public: {
      post: (option: {
        body: Methods_16xdnf7["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<void, BasicHeaders, Methods_16xdnf7["post"]["status"]>(
          prefix,
          PATH2,
          POST,
          option,
        ).send(),
      $post: (option: {
        body: Methods_16xdnf7["post"]["reqBody"];
        config?: T | undefined;
      }) =>
        fetch<void, BasicHeaders, Methods_16xdnf7["post"]["status"]>(
          prefix,
          PATH2,
          POST,
          option,
        )
          .send()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH2}`,
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

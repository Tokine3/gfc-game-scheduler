import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods_2yw7dz } from "./_id@string";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? "" : baseURL).replace(/\/$/, "");
  const PATH0 = "/servers/fav";
  const PATCH = "PATCH";

  return {
    _id: (val0: string) => {
      const prefix0 = `${PATH0}/${val0}`;

      return {
        /**
         * @returns サーバーをお気に入りに追加しました
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
         * @returns サーバーをお気に入りに追加しました
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
        $path: () => `${prefix}${prefix0}`,
      };
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;

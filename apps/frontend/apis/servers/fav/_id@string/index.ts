/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  patch: {
    status: 200;
    /** サーバーをお気に入りに追加しました */
    resBody: Types.ServerUser;
    reqBody: Types.AddFavServerDto;
  };
}>;

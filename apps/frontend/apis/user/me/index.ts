/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 200;
    /** ログイン中のユーザの取得成功 */
    resBody: Types.User;
  };
}>;

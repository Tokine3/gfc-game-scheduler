/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 200;
    /** 最終ログイン時間の更新と自身のデータ取得成功 */
    resBody: Types.User;
  };
}>;

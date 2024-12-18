/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../@types";

export type Methods = DefineMethods<{
  get: {
    query?:
      | {
          /** ユーザー名 */
          name?: string | undefined;
          /** 取得件数 */
          take?: number | undefined;
          /** 取得開始位置 */
          skip?: number | undefined;
        }
      | undefined;

    status: 200;
    /** 検索条件に当てはまるユーザの取得成功 */
    resBody: Types.FindAllUser;
  };
}>;

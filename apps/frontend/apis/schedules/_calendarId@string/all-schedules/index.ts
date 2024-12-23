/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  get: {
    query: {
      /** 開始日 */
      fromDate: string;
      /** 終了日 */
      toDate: string;
    };

    status: 200;
    /** ユーザーのスケジュール取得成功 */
    resBody: Types.AllUserSchedules;
  };
}>;

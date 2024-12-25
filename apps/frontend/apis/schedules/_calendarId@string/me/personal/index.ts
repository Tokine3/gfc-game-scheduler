/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../@types";

export type Methods = DefineMethods<{
  get: {
    query?:
      | {
          /** 取得開始日 */
          fromDate?: string | undefined;
          /** 取得終了日 */
          toDate?: string | undefined;
        }
      | undefined;

    status: 200;
    /** ユーザーの個人スケジュール取得成功 */
    resBody: Types.PersonalScheduleWithRelations[];
  };
}>;

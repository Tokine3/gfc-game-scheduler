/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  post: {
    status: 200;
    /** 公開スケジュール作成リクエスト */
    reqBody: Types.CreatePublicScheduleDto;
  };

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
    /** 公開スケジュール取得成功 */
    resBody: Types.PublicScheduleWithRelations[];
  };
}>;

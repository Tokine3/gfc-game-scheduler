/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  patch: {
    status: 200;
    /** 公開スケジュール更新成功 */
    resBody: Types.PublicScheduleWithRelations;
    /** 公開スケジュール更新リクエスト */
    reqBody: Types.UpdatePublicScheduleDto;
  };

  delete: {
    status: 200;
    /** 公開スケジュール削除リクエスト */
    reqBody: Types.RemovePublicScheduleDto;
  };
}>;

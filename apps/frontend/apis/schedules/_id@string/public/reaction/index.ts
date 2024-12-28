/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../@types";

export type Methods = DefineMethods<{
  patch: {
    status: 200;
    /** 公開スケジュール参加者更新成功 */
    resBody: Types.PublicScheduleWithRelations;
    /** 公開スケジュール参加者更新リクエスト */
    reqBody: Types.UpdateReactionDto;
  };
}>;

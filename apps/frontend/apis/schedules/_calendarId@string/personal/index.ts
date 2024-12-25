/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  /** 指定された期間の個人スケジュールを一括で作成・更新します */
  post: {
    status: 201;
    /** 個人スケジュール作成成功 */
    resBody: Types.PersonalSchedule;
    /** 個人スケジュール作成リクエスト */
    reqBody: Types.UpsertPersonalScheduleDto[];
  };
}>;

/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  post: {
    status: 201;
    /** 個人スケジュール作成成功 */
    resBody: Types.PersonalSchedule;
    /** 個人スケジュール作成リクエスト */
    reqBody: Types.CreatePersonalScheduleDto[];
  };
}>;

/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  delete: {
    status: 204;
    /** 個人スケジュール削除リクエスト */
    reqBody: Types.RemovePersonalScheduleDto;
  };
}>;

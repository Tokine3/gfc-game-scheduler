/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  delete: {
    status: 200;
    /** 公開スケジュール削除リクエスト */
    reqBody: Types.RemovePublicScheduleDto;
  };
}>;

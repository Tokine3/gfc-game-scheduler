/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
  post: {
    status: 200;
    /** 公開スケジュール作成リクエスト */
    reqBody: Types.CreatePublicScheduleDto;
  };
}>;

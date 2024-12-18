/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../@types";

export type Methods = DefineMethods<{
  post: {
    status: 201;
    /** カレンダー作成成功 */
    resBody: Types.CalendarWithRelations;
    reqBody: Types.CreateCalendarDto;
  };

  get: {
    status: 200;
  };
}>;

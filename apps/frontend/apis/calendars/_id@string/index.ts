/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 201;
    /** カレンダー取得成功 */
    resBody: Types.CalendarWithRelations;
  };

  patch: {
    status: 200;
    /** カレンダー更新成功 */
    resBody: Types.CalendarWithRelations;
    reqBody: Types.UpdateCalendarDto;
  };

  delete: {
    status: 200;
  };
}>;

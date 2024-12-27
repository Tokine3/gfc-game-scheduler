/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    query?:
      | {
          fromDate?: string | undefined;
          toDate?: string | undefined;
        }
      | undefined;

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
}>;

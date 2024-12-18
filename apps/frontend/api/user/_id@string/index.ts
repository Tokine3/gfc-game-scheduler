/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 200;
    /** 指定したユーザの取得成功 */
    resBody: Types.User;
  };

  patch: {
    status: 200;
    /** ユーザの更新成功 */
    resBody: Types.User;
    reqBody: Types.UpdateUserDto;
  };

  delete: {
    status: 200;
  };
}>;

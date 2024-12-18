/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 200;
    /** Discordサーバー取得成功 */
    resBody: Types.GetUserServersResponse;
  };
}>;

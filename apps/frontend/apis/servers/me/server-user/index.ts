/* eslint-disable */
import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
  get: {
    query: {
      serverId: string;
    };

    status: 200;
    /** サーバーに参加しているかどうか */
    resBody: boolean;
  };
}>;

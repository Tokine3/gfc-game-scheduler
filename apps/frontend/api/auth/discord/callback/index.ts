/* eslint-disable */
import type { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
  get: {
    query: {
      error: string;
      /** Discord認証コード */
      code: string;
    };

    status: 200;

    /** Discord認証成功 */
    resBody: {
      success?: boolean | undefined;
    };
  };
}>;

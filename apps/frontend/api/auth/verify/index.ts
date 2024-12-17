/* eslint-disable */
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    status: 200;

    /** トークンが有効 */
    resBody: {
      /** Discord User ID */
      userId?: string | undefined;
    };
  };
}>;

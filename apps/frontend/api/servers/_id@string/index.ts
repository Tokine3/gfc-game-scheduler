/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
  get: {
    status: 200;
  };

  patch: {
    status: 200;
    reqBody: Types.UpdateServerDto;
  };

  delete: {
    status: 200;
  };
}>;

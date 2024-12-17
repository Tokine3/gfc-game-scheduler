/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  patch: {
    status: 200;
    reqBody: Types.UpdateUserDto;
  };

  delete: {
    status: 200;
  };
}>;

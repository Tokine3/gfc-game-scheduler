/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../@types';

export type Methods = DefineMethods<{
  post: {
    status: 201;
    reqBody: Types.CreateUserDto;
  };

  get: {
    status: 200;
  };
}>;

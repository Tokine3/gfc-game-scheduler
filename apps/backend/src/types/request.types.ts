import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    name: string;
    avatar?: string;
    accessToken?: string; // Discord OAuth2トークン
  };
  headers: Request['headers'] & {
    'x-discord-id': string;
    'x-discord-token': string;
  };
}

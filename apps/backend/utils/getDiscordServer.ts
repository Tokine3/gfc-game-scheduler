import { RequestWithUser } from '../src/types/request.types';
import { logger } from '../src/utils/logger';

export const getUserDiscordServer = async (req: RequestWithUser) => {
  const discordToken = req.headers['x-discord-token'];
  logger.log('Fetching Discord servers with token:', {
    hasToken: !!discordToken,
    tokenPrefix: discordToken?.substring(0, 10),
  });

  logger.log('Discord token:', discordToken);

  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${discordToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    logger.error('Discord API error:', {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(`Discord API error: ${response.status}`);
  }

  const guilds = await response.json();
  return guilds;
};

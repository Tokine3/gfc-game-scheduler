import { RequestWithUser } from 'src/types/request.types';
import { logger } from './logger';

export async function getUserDiscordServer(req: RequestWithUser) {
  try {
    const discordToken = req.cookies['discord_token'];
    const response = await fetch(
      'https://discord.com/api/v10/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${discordToken}`,
          'User-Agent': 'GFC Scheduler (1.0.0)', // User-Agentを追加
        },
      }
    );

    const data = await response.json();

    // レート制限チェック
    if (response.status === 429) {
      return data; // retry_afterを含むレスポンスを返す
    }

    return data;
  } catch (error) {
    logger.error('Error fetching Discord servers:', error);
    throw error;
  }
}

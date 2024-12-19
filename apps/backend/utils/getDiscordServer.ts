import { RequestWithUser } from '../src/types/request.types';

export const getUserDiscordServer = async (req: RequestWithUser) => {
  const discordToken = req.headers['x-discord-token'];
  console.log('discordToken', discordToken);
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bearer ${discordToken}` },
  });

  const guilds = await response.json();
  return guilds;
};

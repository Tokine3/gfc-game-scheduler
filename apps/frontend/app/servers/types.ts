export type Server = {
  id: string;
  name: string;
  icon: string | null;
  calendars: Array<{
    id: string;
    name: string;
  }>;
  isJoined?: boolean;
  isFavorite?: boolean;
  updatedAt?: string;
};

export type ServerMinimal = {
  id: string;
  name: string;
  icon: string | null;
};

export type FavoriteStates = {
  [key: string]: boolean;
};

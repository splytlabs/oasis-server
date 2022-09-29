export type Args = Object;

export type Collection = Args & {
  tokenAddress: string;
  name: string;
  slug: string;
  webUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
};

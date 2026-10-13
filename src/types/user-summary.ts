import type { GitHubUser } from "./github-user.js";

export type UserSummary = Pick<
  GitHubUser,
  "login" | "id" | "avatar_url"
>;

export type UserProfileInfo = Omit<
  GitHubUser,
  "avatar_url"
>;

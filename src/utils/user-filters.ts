import type { GitHubUser } from "../types/github-user.js";
import type { UserProfileInfo } from "../types/user-summary.js";

export interface UserFilterOptions {
  minimumLoginLength: number;
  searchText: string;
  sortValue: "" | "asc" | "desc";
}

export function filterUsers(
  users: GitHubUser[],
  options: UserFilterOptions
): GitHubUser[] {
  const { minimumLoginLength, searchText, sortValue } = options;

  const filteredUsers = users.filter((user) => {
    const matchesLength =
      user.login.length >= minimumLoginLength;

    const matchesSearch = user.login
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesLength && matchesSearch;
  });

  if (sortValue === "asc") {
    filteredUsers.sort((a, b) =>
      a.login.toLowerCase().localeCompare(b.login.toLowerCase())
    );
  } else if (sortValue === "desc") {
    filteredUsers.sort((a, b) =>
      b.login.toLowerCase().localeCompare(a.login.toLowerCase())
    );
  }

  return filteredUsers;
}

export function getUserProfileInfo(
  user: GitHubUser
): UserProfileInfo {
  const { avatar_url, ...profileInfo } = user;

  return profileInfo;
}

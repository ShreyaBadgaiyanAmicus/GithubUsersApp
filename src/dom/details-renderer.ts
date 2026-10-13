import type { GitHubUser } from "../types/github-user.js";
import type { GitHubFollower } from "../types/github-follower.js";
import type { GitHubRepository } from "../types/github-repository.js";
import { getElement } from "./ui-helper.js";
import { getUserProfileInfo } from "../utils/user-filters.js";

export function renderUserProfile(user: GitHubUser): void {
  const profileInfo = getUserProfileInfo(user);

  const avatar = getElement<HTMLImageElement>("user-avatar");
  const login = getElement<HTMLHeadingElement>("user-login");
  const id = getElement<HTMLSpanElement>("user-id");

  avatar.src = user.avatar_url;
  avatar.alt = profileInfo.login;
  login.textContent = profileInfo.login;
  id.textContent = String(profileInfo.id);
}

export function renderFollowers(
  followers: GitHubFollower[]
): void {
  const container = getElement<HTMLDivElement>("followers-container");
  container.innerHTML = "";

  followers.slice(0, 5).forEach((follower) => {
    const card = document.createElement("div");
    card.className = "follower-card";

    const avatar = document.createElement("img");
    avatar.src = follower.avatar_url;
    avatar.alt = follower.login;

    const name = document.createElement("p");
    name.textContent = follower.login;

    card.append(avatar, name);
    container.appendChild(card);
  });
}

export function renderRepositories(
  repositories: GitHubRepository[]
): void {
  const container = getElement<HTMLDivElement>("repositories-container");
  container.innerHTML = "";

  repositories.slice(0, 5).forEach((repository) => {
    const card = document.createElement("div");
    card.className = "repository-card";

    const name = document.createElement("h3");
    name.textContent = repository.name;

    const description = document.createElement("p");
    description.textContent =
      repository.description ?? "No description available.";

    card.append(name, description);
    container.appendChild(card);
  });
}

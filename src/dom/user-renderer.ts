import type { UserSummary } from "../types/user-summary.js";
import type { GitHubFollower } from "../types/github-follower.js";
import type { GitHubRepository } from "../types/github-repository.js";

export function renderUsers(
  container: HTMLElement,
  users: UserSummary[]
): void {
  container.innerHTML = "";

  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";

    const avatar = document.createElement("img");
    avatar.src = user.avatar_url;
    avatar.alt = user.login;

    const username = document.createElement("h3");
    username.textContent = user.login;

    const id = document.createElement("p");
    id.textContent = `ID: ${user.id}`;

    card.append(avatar, username, id);

    card.addEventListener("click", () => {
      window.location.href =
        `user-details.html?username=${encodeURIComponent(user.login)}`;
    });

    container.appendChild(card);
  });
}

export function renderFollowers(
  container: HTMLElement,
  followers: GitHubFollower[]
): void {
  container.innerHTML = "";

  followers.slice(0, 5).forEach((follower) => {
    const card = document.createElement("div");
    card.className = "follower-card";

    const avatar = document.createElement("img");
    avatar.src = follower.avatar_url;
    avatar.alt = follower.login;

    const username = document.createElement("p");
    username.textContent = follower.login;

    card.append(avatar, username);
    container.appendChild(card);
  });
}

export function renderRepositories(
  container: HTMLElement,
  repositories: GitHubRepository[]
): void {
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

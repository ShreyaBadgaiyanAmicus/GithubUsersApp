import { getElement } from "./ui-helper.js";
import { getUserProfileInfo } from "../utils/user-filters.js";
export function renderUserProfile(user) {
    const profileInfo = getUserProfileInfo(user);
    const avatar = getElement("user-avatar");
    const login = getElement("user-login");
    const id = getElement("user-id");
    avatar.src = user.avatar_url;
    avatar.alt = profileInfo.login;
    login.textContent = profileInfo.login;
    id.textContent = String(profileInfo.id);
}
export function renderFollowers(followers) {
    const container = getElement("followers-container");
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
export function renderRepositories(repositories) {
    const container = getElement("repositories-container");
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

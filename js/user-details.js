const params = new URLSearchParams(window.location.search);

const username = params.get("username");

console.log("Selected username:", username);

async function fetchUserDetails() {
  const loading = document.getElementById("details-loading");

  const errorMessage = document.getElementById("details-error");

  const userDetails = document.getElementById("user-details");

  try {
    loading.style.display = "block";
    errorMessage.style.display = "none";
    userDetails.style.display = "none";

    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
    );

    if (!userResponse.ok) {
      if (userResponse.status === 403 || userResponse.status === 429) {
        throw new Error(
          "GitHub API rate limit reached. Please try again later.",
        );
      }

      if (userResponse.status === 404) {
        throw new Error("User could not be found.");
      }

      throw new Error("Failed to load user details.");
    }

    const user = await userResponse.json();

    document.getElementById("user-avatar").src = user.avatar_url;

    document.getElementById("user-avatar").alt = user.login;

    document.getElementById("user-login").textContent = user.login;

    document.getElementById("user-id").textContent = user.id;

    const [followersResponse, repositoriesResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/followers`),

      fetch(`https://api.github.com/users/${username}/repos`),
    ]);

    if (!followersResponse.ok || !repositoriesResponse.ok) {
      if (
        followersResponse.status === 403 ||
        followersResponse.status === 429 ||
        repositoriesResponse.status === 403 ||
        repositoriesResponse.status === 429
      ) {
        throw new Error(
          "GitHub API rate limit reached. Please try again later.",
        );
      }

      throw new Error("Failed to load followers or repositories.");
    }

    const [followers, repositories] = await Promise.all([
      followersResponse.json(),

      repositoriesResponse.json(),
    ]);

    displayFollowers(followers);

    displayRepositories(repositories);

    userDetails.style.display = "block";
  } catch (error) {
    console.error("Error loading user details:", error);

    errorMessage.textContent = error.message;

    errorMessage.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

function displayFollowers(followers) {
  const container = document.getElementById("followers-container");

  container.innerHTML = "";

  followers.slice(0, 5).forEach((follower) => {
    const followerElement = document.createElement("div");

    followerElement.className = "follower-card";

    followerElement.innerHTML = `
            <img
                src="${follower.avatar_url}"
                alt="${follower.login}"
            >

            <p>${follower.login}</p>
        `;

    container.appendChild(followerElement);
  });
}

function displayRepositories(repositories) {
  const container = document.getElementById("repositories-container");

  container.innerHTML = "";

  repositories.slice(0, 5).forEach((repository) => {
    const repositoryElement = document.createElement("div");

    repositoryElement.className = "repository-card";

    repositoryElement.innerHTML = `
            <h3>${repository.name}</h3>

            <p>
                ${repository.description || "No description available."}
            </p>
        `;

    container.appendChild(repositoryElement);
  });
}

fetchUserDetails();

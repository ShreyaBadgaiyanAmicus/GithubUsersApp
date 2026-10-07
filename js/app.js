const usersPerPage = 10;
let currentPage = 1;
let allUsers = [];
let currentUsers = [];

let minimumLoginLength = 0;
let searchText = "";
let sortValue = "";

async function fetchUsers() {
  const skeleton = document.getElementById("loading-skeleton");
  const errorMessage = document.getElementById("error-message");
  const userContainer = document.getElementById("user-container");
  const pagination = document.getElementById("pagination");

  try {
    skeleton.style.display = "grid";
    errorMessage.style.display = "none";

    const response = await fetch("https://api.github.com/users");

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error(
          "GitHub API rate limit reached. Please try again later.",
        );
      }

      throw new Error("Failed to fetch GitHub users");
    }

    const users = await response.json();

    allUsers = users;
    currentUsers = users;

    const userCount = document.getElementById("user-count");

    userCount.textContent = `Total users fetched: ${users.length}`;

    console.log(users);

    displayUsers(currentUsers);
    setupPagination();
  } catch (error) {
    console.error("Error loading users:", error);

    const userCount = document.getElementById("user-count");
    userCount.textContent = "Users found: 0";

    errorMessage.textContent = error.message;

    errorMessage.style.display = "block";

    userContainer.innerHTML = "";

    pagination.style.display = "none";
  } finally {
    skeleton.style.display = "none";
  }
}

function displayUsers(users) {
  const container = document.getElementById("user-container");

  container.innerHTML = "";

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const usersToDisplay = users.slice(startIndex, endIndex);

  usersToDisplay.forEach((user) => {

    const userElement = document.createElement("div");

    userElement.className = "user-card";

    userElement.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}">
        <h3>${user.login}</h3>
        <p>ID: ${user.id}</p>
    `;

    userElement.addEventListener("click", () => {
        window.location.href =
            `user-details.html?username=${user.login}`;
    });

    container.appendChild(userElement);
});
}

function updateButtons() {

    const prevButton =
        document.getElementById("prev-btn");

    const nextButton =
        document.getElementById("next-btn");

    const pageNumbers =
        document.getElementById("page-numbers");

    const totalPages =
        Math.ceil(currentUsers.length / usersPerPage);

    prevButton.disabled =
        currentPage === 1;

    nextButton.disabled =
        currentPage === totalPages;

    pageNumbers.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {

        const pageButton =
            document.createElement("button");

        pageButton.textContent = page;

        pageButton.className = "page-number";

        if (page === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {

            currentPage = page;

            displayUsers(currentUsers);

            updateButtons();
        });

        pageNumbers.appendChild(pageButton);
    }
}
function applyFilters() {
  currentUsers = allUsers.filter((user) => {
    const matchesLength = user.login.length >= minimumLoginLength;

    const matchesSearch = user.login.toLowerCase().includes(searchText);

    return matchesLength && matchesSearch;
  });

  if (sortValue === "asc") {
    currentUsers.sort((a, b) =>
      a.login.toLowerCase().localeCompare(b.login.toLowerCase()),
    );
  }

  if (sortValue === "desc") {
    currentUsers.sort((a, b) =>
      b.login.toLowerCase().localeCompare(a.login.toLowerCase()),
    );
  }

  currentPage = 1;

  const userCount = document.getElementById("user-count");
  userCount.textContent = `Users found: ${currentUsers.length}`;

  displayUsers(currentUsers);
  updateButtons();
}

function applyLoginLengthFilter() {
  const input = document.getElementById("login-length");

  minimumLoginLength = Number(input.value) || 0;

  applyFilters();
}

function searchUsers() {
  const input = document.getElementById("search-user");

  searchText = input.value.toLowerCase();

  applyFilters();
}

function sortUsers() {
  sortValue = document.getElementById("sort-users").value;

  applyFilters();
}

function setupPagination() {
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayUsers(currentUsers);
      updateButtons();
    }
  });

  nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(currentUsers.length / usersPerPage);

    if (currentPage < totalPages) {
      currentPage++;
      displayUsers(currentUsers);
      updateButtons();
    }
  });

  updateButtons();
}

fetchUsers();

document
  .getElementById("apply-filter")
  .addEventListener("click", applyLoginLengthFilter);

document.getElementById("search-user").addEventListener("input", searchUsers);

document.getElementById("sort-users").addEventListener("change", sortUsers);

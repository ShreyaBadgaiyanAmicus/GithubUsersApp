import { renderUsers } from "../dom/user-renderer.js";
import { getElement } from "../dom/ui-helper.js";
import { filterUsers } from "../utils/user-filters.js";
import { paginate } from "../utils/pagination.js";
export class UsersController {
    constructor(apiService) {
        this.apiService = apiService;
        this.usersPerPage = 10;
        this.currentPage = 1;
        this.allUsers = [];
        this.currentUsers = [];
        this.minimumLoginLength = 0;
        this.searchText = "";
        this.sortValue = "";
        this.skeleton = getElement("loading-skeleton");
        this.errorMessage = getElement("error-message");
        this.userContainer = getElement("user-container");
        this.pagination = getElement("pagination");
        this.userCount = getElement("user-count");
        this.previousButton = getElement("prev-btn");
        this.nextButton = getElement("next-btn");
        this.pageNumbers = getElement("page-numbers");
        this.loginLengthInput = getElement("login-length");
        this.searchInput = getElement("search-user");
        this.sortSelect = getElement("sort-users");
        this.applyFilterButton = getElement("apply-filter");
    }
    init() {
        this.applyFilterButton.addEventListener("click", () => {
            this.applyLoginLengthFilter();
        });
        this.searchInput.addEventListener("input", (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                this.searchUsers(target.value);
            }
        });
        this.sortSelect.addEventListener("change", () => {
            this.sortUsers();
        });
        this.previousButton.addEventListener("click", () => {
            this.goToPreviousPage();
        });
        this.nextButton.addEventListener("click", () => {
            this.goToNextPage();
        });
        void this.loadUsers();
    }
    async loadUsers() {
        this.skeleton.style.display = "grid";
        this.errorMessage.style.display = "none";
        this.errorMessage.textContent = "";
        try {
            const result = await this.apiService.getUsers();
            if (!result.success) {
                throw new Error(result.error);
            }
            this.allUsers = result.data;
            this.currentUsers = [...this.allUsers];
            this.userCount.textContent =
                `Total users fetched: ${this.allUsers.length}`;
            this.displayUsers();
            this.updatePagination();
        }
        catch (error) {
            console.error("Error loading users:", error);
            this.userCount.textContent = "Users found: 0";
            this.errorMessage.textContent =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.";
            this.errorMessage.style.display = "block";
            this.userContainer.innerHTML = "";
            this.pageNumbers.innerHTML = "";
            this.pagination.style.display = "none";
        }
        finally {
            this.skeleton.style.display = "none";
        }
    }
    displayUsers() {
        const result = paginate(this.currentUsers, this.currentPage, this.usersPerPage);
        this.currentPage = result.currentPage;
        renderUsers(this.userContainer, result.items);
    }
    updatePagination() {
        const totalPages = Math.ceil(this.currentUsers.length / this.usersPerPage);
        this.previousButton.disabled = this.currentPage <= 1;
        this.nextButton.disabled =
            totalPages === 0 || this.currentPage >= totalPages;
        this.pageNumbers.innerHTML = "";
        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = String(page);
            pageButton.className = "page-number";
            if (page === this.currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                this.currentPage = page;
                this.displayUsers();
                this.updatePagination();
            });
            this.pageNumbers.appendChild(pageButton);
        }
        this.pagination.style.display =
            totalPages > 0 ? "flex" : "none";
    }
    applyFilters() {
        this.currentUsers = filterUsers(this.allUsers, {
            minimumLoginLength: this.minimumLoginLength,
            searchText: this.searchText,
            sortValue: this.sortValue
        });
        this.currentPage = 1;
        this.userCount.textContent =
            `Users found: ${this.currentUsers.length}`;
        this.displayUsers();
        this.updatePagination();
    }
    applyLoginLengthFilter() {
        const inputValue = this.loginLengthInput.value.trim();
        const minimumLength = Number(inputValue);
        if (inputValue !== "" &&
            (!Number.isFinite(minimumLength) ||
                minimumLength < 0 ||
                !Number.isInteger(minimumLength))) {
            alert("Minimum login length must be a non-negative whole number.");
            this.loginLengthInput.value = "";
            return;
        }
        this.minimumLoginLength =
            inputValue === "" ? 0 : minimumLength;
        this.applyFilters();
    }
    searchUsers(value) {
        this.searchText = (value ?? this.searchInput.value)
            .trim()
            .toLowerCase();
        this.applyFilters();
    }
    sortUsers() {
        const value = this.sortSelect.value;
        if (value === "asc" || value === "desc" || value === "") {
            this.sortValue = value;
        }
        else {
            this.sortValue = "";
        }
        this.applyFilters();
    }
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayUsers();
            this.updatePagination();
        }
    }
    goToNextPage() {
        const totalPages = Math.ceil(this.currentUsers.length / this.usersPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayUsers();
            this.updatePagination();
        }
    }
}

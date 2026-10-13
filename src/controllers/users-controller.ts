import { ApiService } from "../services/api-service.js";
import { renderUsers } from "../dom/user-renderer.js";
import { getElement } from "../dom/ui-helper.js";
import { filterUsers } from "../utils/user-filters.js";
import { paginate } from "../utils/pagination.js";
import type { GitHubUser } from "../types/github-user.js";

export class UsersController {
  constructor(private readonly apiService: ApiService) {}

  private readonly usersPerPage = 10;
  private currentPage = 1;

  private allUsers: GitHubUser[] = [];
  private currentUsers: GitHubUser[] = [];

  private minimumLoginLength = 0;
  private searchText = "";
  private sortValue: "" | "asc" | "desc" = "";

  private readonly skeleton =
    getElement<HTMLDivElement>("loading-skeleton");
  private readonly errorMessage =
    getElement<HTMLDivElement>("error-message");
  private readonly userContainer =
    getElement<HTMLDivElement>("user-container");
  private readonly pagination =
    getElement<HTMLDivElement>("pagination");
  private readonly userCount =
    getElement<HTMLParagraphElement>("user-count");

  private readonly previousButton =
    getElement<HTMLButtonElement>("prev-btn");
  private readonly nextButton =
    getElement<HTMLButtonElement>("next-btn");
  private readonly pageNumbers =
    getElement<HTMLDivElement>("page-numbers");

  private readonly loginLengthInput =
    getElement<HTMLInputElement>("login-length");
  private readonly searchInput =
    getElement<HTMLInputElement>("search-user");
  private readonly sortSelect =
    getElement<HTMLSelectElement>("sort-users");
  private readonly applyFilterButton =
    getElement<HTMLButtonElement>("apply-filter");

  public init(): void {
    this.applyFilterButton.addEventListener("click", (): void => {
      this.applyLoginLengthFilter();
    });

    this.searchInput.addEventListener("input", (event: Event): void => {
      const target = event.target;

      if (target instanceof HTMLInputElement) {
        this.searchUsers(target.value);
      }
    });

    this.sortSelect.addEventListener("change", (): void => {
      this.sortUsers();
    });

    this.previousButton.addEventListener("click", (): void => {
      this.goToPreviousPage();
    });

    this.nextButton.addEventListener("click", (): void => {
      this.goToNextPage();
    });

    void this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
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
    } catch (error: unknown) {
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
    } finally {
      this.skeleton.style.display = "none";
    }
  }

  private displayUsers(): void {
    const result = paginate(
      this.currentUsers,
      this.currentPage,
      this.usersPerPage
    );

    this.currentPage = result.currentPage;
    renderUsers(this.userContainer, result.items);
  }

  private updatePagination(): void {
    const totalPages = Math.ceil(
      this.currentUsers.length / this.usersPerPage
    );

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

  private applyFilters(): void {
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

  private applyLoginLengthFilter(): void {
    const inputValue = this.loginLengthInput.value.trim();
    const minimumLength = Number(inputValue);

    if (
      inputValue !== "" &&
      (!Number.isFinite(minimumLength) ||
        minimumLength < 0 ||
        !Number.isInteger(minimumLength))
    ) {
      alert(
        "Minimum login length must be a non-negative whole number."
      );
      this.loginLengthInput.value = "";
      return;
    }

    this.minimumLoginLength =
      inputValue === "" ? 0 : minimumLength;

    this.applyFilters();
  }

  private searchUsers(value?: string): void {
    this.searchText = (value ?? this.searchInput.value)
      .trim()
      .toLowerCase();
    this.applyFilters();
  }

  private sortUsers(): void {
    const value = this.sortSelect.value;

    if (value === "asc" || value === "desc" || value === "") {
      this.sortValue = value;
    } else {
      this.sortValue = "";
    }

    this.applyFilters();
  }

  private goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.displayUsers();
      this.updatePagination();
    }
  }

  private goToNextPage(): void {
    const totalPages = Math.ceil(
      this.currentUsers.length / this.usersPerPage
    );

    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.displayUsers();
      this.updatePagination();
    }
  }
}

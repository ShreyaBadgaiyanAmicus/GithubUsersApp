import { renderUserProfile, renderFollowers, renderRepositories } from "../dom/details-renderer.js";
import { getElement } from "../dom/ui-helper.js";
export class UserDetailsController {
    constructor(apiService) {
        this.apiService = apiService;
        this.loading = getElement("details-loading");
        this.errorMessage = getElement("details-error");
        this.userDetails = getElement("user-details");
    }
    init() {
        void this.loadUserDetails();
    }
    async loadUserDetails() {
        this.loading.style.display = "block";
        this.errorMessage.style.display = "none";
        this.errorMessage.textContent = "";
        this.userDetails.style.display = "none";
        try {
            const params = new URLSearchParams(window.location.search);
            const username = params.get("username")?.trim();
            if (!username) {
                throw new Error("No GitHub username was provided.");
            }
            const userResult = await this.apiService.getUser(username);
            if (!userResult.success) {
                throw new Error(userResult.error);
            }
            renderUserProfile(userResult.data);
            const [followersResult, repositoriesResult] = await Promise.allSettled([
                this.apiService.getFollowers(username),
                this.apiService.getRepositories(username)
            ]);
            let followers = [];
            let repositories = [];
            const errors = [];
            if (followersResult.status === "fulfilled") {
                if (!followersResult.value.success) {
                    errors.push(followersResult.value.error);
                }
                else {
                    followers = followersResult.value.data;
                }
            }
            else {
                errors.push("Followers could not be loaded.");
            }
            if (repositoriesResult.status === "fulfilled") {
                if (!repositoriesResult.value.success) {
                    errors.push(repositoriesResult.value.error);
                }
                else {
                    repositories = repositoriesResult.value.data;
                }
            }
            else {
                errors.push("Repositories could not be loaded.");
            }
            if (followers.length > 0) {
                renderFollowers(followers);
            }
            if (repositories.length > 0) {
                renderRepositories(repositories);
            }
            if (errors.length > 0) {
                this.errorMessage.textContent = errors.join(" ");
                this.errorMessage.style.display = "block";
            }
            this.userDetails.style.display = "block";
        }
        catch (error) {
            console.error("Error loading user details:", error);
            this.errorMessage.textContent =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.";
            this.errorMessage.style.display = "block";
        }
        finally {
            this.loading.style.display = "none";
        }
    }
}

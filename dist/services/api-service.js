import { fetchData } from "./api-helper.js";
const BASE_URL = "https://api.github.com";
export class ApiService {
    async getUser(username) {
        try {
            const user = await fetchData(`${BASE_URL}/users/${encodeURIComponent(username)}`);
            return { success: true, data: user };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Failed to load GitHub user."
            };
        }
    }
    async getUsers() {
        try {
            const users = await fetchData(`${BASE_URL}/users`);
            return { success: true, data: users };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Failed to load GitHub users."
            };
        }
    }
    async getFollowers(username) {
        try {
            const followers = await fetchData(`${BASE_URL}/users/${encodeURIComponent(username)}/followers`);
            return { success: true, data: followers };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Failed to load followers."
            };
        }
    }
    async getRepositories(username) {
        try {
            const repositories = await fetchData(`${BASE_URL}/users/${encodeURIComponent(username)}/repos`);
            return { success: true, data: repositories };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Failed to load repositories."
            };
        }
    }
}

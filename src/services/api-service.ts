import { fetchData } from "./api-helper.js";
import type { GitHubUser } from "../types/github-user.js";
import type { GitHubFollower } from "../types/github-follower.js";
import type { GitHubRepository } from "../types/github-repository.js";
import type { ApiResult } from "../types/api-result.js";

const BASE_URL = "https://api.github.com";

export class ApiService {
  async getUser(
    username: string
  ): Promise<ApiResult<GitHubUser>> {
    try {
      const user = await fetchData<GitHubUser>(
        `${BASE_URL}/users/${encodeURIComponent(username)}`
      );

      return { success: true, data: user };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load GitHub user."
      };
    }
  }

  async getUsers(): Promise<ApiResult<GitHubUser[]>> {
    try {
      const users = await fetchData<GitHubUser[]>(
        `${BASE_URL}/users`
      );

      return { success: true, data: users };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load GitHub users."
      };
    }
  }

  async getFollowers(
    username: string
  ): Promise<ApiResult<GitHubFollower[]>> {
    try {
      const followers = await fetchData<GitHubFollower[]>(
        `${BASE_URL}/users/${encodeURIComponent(username)}/followers`
      );

      return { success: true, data: followers };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load followers."
      };
    }
  }

  async getRepositories(
    username: string
  ): Promise<ApiResult<GitHubRepository[]>> {
    try {
      const repositories = await fetchData<GitHubRepository[]>(
        `${BASE_URL}/users/${encodeURIComponent(username)}/repos`
      );

      return { success: true, data: repositories };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load repositories."
      };
    }
  }
}

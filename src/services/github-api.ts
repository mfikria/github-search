import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  GitHubRepository,
  SearchUsersResponse,
  SearchUsersParams,
  GetRepositoriesParams
} from './types';

class GitHubApiClient {
  private client: AxiosInstance;

  constructor(baseURL = 'https://api.github.com') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'github-search-app'
      },
      timeout: 10000
    });

    this.client.interceptors.request.use((config) => {
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
      if (token) {
        config.headers.Authorization = `token ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async searchUsers(params: SearchUsersParams): Promise<SearchUsersResponse> {
    const { q, page = 1, per_page = 30 } = params;

    const searchParams = new URLSearchParams({
      q,
      page: page.toString(),
      per_page: per_page.toString()
    });

    const response: AxiosResponse<SearchUsersResponse> = await this.client.get(
      `/search/users?${searchParams.toString()}`
    );

    return response.data;
  }

  async getUserRepositories(
    username: string,
    params: GetRepositoriesParams = {}
  ): Promise<GitHubRepository[]> {
    const { page = 1, per_page = 30 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString()
    });

    const response: AxiosResponse<GitHubRepository[]> = await this.client.get(
      `/users/${username}/repos?${searchParams.toString()}`
    );

    return response.data;
  }
}

// Export singleton instance
export const githubApi = new GitHubApiClient();
export default GitHubApiClient;

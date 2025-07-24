'use client';

import { create } from 'zustand';
import { githubApi } from '@/services/github-api';
import { GitHubUser, GitHubRepository } from '@/services/types';

export interface UserWithRepos {
  user: GitHubUser;
  repositories: GitHubRepository[];
  loading: boolean;
  error: string | null;
}

interface GitHubState {
  searchResults: UserWithRepos[];
  isSearching: boolean;
  hasSearched: boolean;
  searchError: string | null;
  searchQuery: string;
  searchUsers: (query: string, maxUsers?: number) => Promise<void>;
  fetchUserRepositories: (username: string, maxRepos?: number) => Promise<void>;
  toggleAccordion: (username: string) => void;
  reset: () => void;
  setSearchQuery: (query: string) => void;
}

export const useGitHubStore = create<GitHubState>((set, get) => ({
  searchResults: [],
  isSearching: false,
  hasSearched: false,
  searchError: null,
  searchQuery: '',
  searchUsers: async (query: string, maxUsers: number = 5) => {
    if (!query.trim()) return;

    set({
      isSearching: true,
      hasSearched: true,
      searchError: null,
      searchQuery: query
    });

    try {
      const response = await githubApi.searchUsers({
        q: query,
        per_page: maxUsers
      });

      if (response.items.length > 0) {
        const usersWithRepos: UserWithRepos[] = response.items.map(user => ({
          user,
          repositories: [],
          loading: false,
          error: null
        }));

        set({
          searchResults: usersWithRepos,
          isSearching: false,
          searchError: null
        });
      } else {
        set({
          searchResults: [],
          isSearching: false,
          searchError: null
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({
        isSearching: false,
        searchError: errorMessage,
        searchResults: []
      });
    }
  },

  fetchUserRepositories: async (username: string, maxRepos: number = 100) => {
    const { searchResults } = get();
    const userIndex = searchResults.findIndex(result => result.user.login === username);
    if (userIndex === -1) return;

    set({
      searchResults: searchResults.map((result, index) => 
        index === userIndex 
          ? { ...result, loading: true, error: null }
          : result
      )
    });

    try {
      const repositories = await githubApi.getUserRepositories(username, { per_page: maxRepos });
      const { searchResults: currentResults } = get();
      const currentUserIndex = currentResults.findIndex(result => result.user.login === username);
      
      if (currentUserIndex !== -1) {
        set({
          searchResults: currentResults.map((result, index) => 
            index === currentUserIndex 
              ? { 
                  ...result, 
                  repositories, 
                  loading: false, 
                  error: null 
                }
              : result
          )
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to fetch repositories for ${username}`;
      
      const { searchResults: currentResults } = get();
      const currentUserIndex = currentResults.findIndex(result => result.user.login === username);
      
      if (currentUserIndex !== -1) {
        set({
          searchResults: currentResults.map((result, index) => 
            index === currentUserIndex 
              ? { 
                  ...result, 
                  repositories: [], 
                  loading: false, 
                  error: errorMessage 
                }
              : result
          )
        });
      }
    }
  },

  toggleAccordion: (username: string) => {
    const { searchResults, fetchUserRepositories } = get();
    const user = searchResults.find(result => result.user.login === username);
    if (user && user.repositories.length === 0 && !user.loading) {
      fetchUserRepositories(username, 100);
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  reset: () => {
    set({
      searchResults: [],
      isSearching: false,
      hasSearched: false,
      searchError: null,
      searchQuery: ''
    });
  }
}));

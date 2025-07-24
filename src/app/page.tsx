'use client';

import React from 'react';
import { Container, Input, Button, Accordion, AccordionItem, RepositoryCard, SearchIcon, LoadingSpinner, GitHubIcon } from '@/components';
import { useGitHubStore } from '@/store';

export default function Home() {
  const {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchError,
    searchUsers,
    toggleAccordion,
    setSearchQuery
  } = useGitHubStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchUsers(searchQuery, 5);
  };

  const handleAccordionToggle = (username: string) => {
    toggleAccordion(username);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="md" padding="lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <GitHubIcon className="h-10 w-10 text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">GitHub Search</h1>
          </div>
          <p className="text-gray-600">Search for GitHub users and explore their repositories</p>
        </div>

        <div className="w-full mb-8">
          <div className="sm:hidden space-y-4">
            <Input
              placeholder="Search GitHub users..."
              leftIcon={SearchIcon}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12"
            />

            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              loading={isSearching}
              className="w-full h-12"
            >
              {isSearching ? 'Searching...' : 'Search Users'}
            </Button>
          </div>

          <div className="hidden sm:flex gap-3 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search GitHub users..."
                leftIcon={SearchIcon}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12"
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              loading={isSearching}
              className="px-8 flex-shrink-0 h-12"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {isSearching && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Searching for users...</p>
            </div>
          )}

          {hasSearched && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-8">
              {searchError ? (
                <div>
                  <p className="text-red-600">Error: {searchError}</p>
                  <p className="text-sm text-gray-500 mt-2">Please try again</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">No users found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Showing up to 5 users for &quot;{searchQuery}&quot;
              </p>

              <Accordion key={searchQuery} allowMultiple>
                {searchResults.map((userWithRepos) => (
                  <AccordionItem
                    key={userWithRepos.user.id}
                    onCustomToggle={() => handleAccordionToggle(userWithRepos.user.login)}
                      title={
                        <div className="flex items-center space-x-3 w-full">
                          <img
                            src={userWithRepos.user.avatar_url}
                            alt={userWithRepos.user.login}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900 truncate">{userWithRepos.user.login}</h3>
                              <a
                                href={userWithRepos.user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile →
                              </a>
                            </div>
                          </div>
                        </div>
                      }
                    >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-3">Repositories</h4>

                        {userWithRepos.loading ? (
                          <div className="flex items-center justify-center py-8">
                            <LoadingSpinner size="md" />
                            <span className="ml-2 text-gray-600">Loading repositories...</span>
                          </div>
                        ) : userWithRepos.error ? (
                          <div className="text-center py-4">
                            <p className="text-red-600">Error loading repositories: {userWithRepos.error}</p>
                          </div>
                        ) : userWithRepos.repositories.length > 0 ? (
                          <div className="overflow-x-auto overflow-y-hidden scrollbar-thin">
                            <div className="grid grid-rows-3 grid-flow-col gap-4 auto-cols-max pb-2 min-h-[420px]">
                              {userWithRepos.repositories.map((repo) => (
                                <RepositoryCard
                                  key={repo.id}
                                  title={repo.name}
                                  description={repo.description}
                                  starCount={repo.stargazers_count}
                                  onClick={() => window.open(repo.html_url, '_blank')}
                                  className="w-80 h-32 flex-shrink-0"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No public repositories found
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

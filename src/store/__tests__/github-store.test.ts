import { act, renderHook } from '@testing-library/react'
import { useGitHubStore } from '../github-store'

jest.mock('@/services/github-api', () => ({
  githubApi: {
    searchUsers: jest.fn(),
    getUserRepositories: jest.fn(),
  }
}))

import { githubApi } from '@/services/github-api'
const mockGitHubApi = githubApi as jest.Mocked<typeof githubApi>

const mockUser = {
  id: 1,
  login: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/testuser',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
  score: 1.0
}

const mockRepository = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  html_url: 'https://github.com/testuser/test-repo',
  description: 'A test repository',
  stargazers_count: 10,
  language: 'TypeScript',
  updated_at: '2023-01-01T00:00:00Z',
  private: false,
  fork: false
}

describe('useGitHubStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useGitHubStore.setState({
      searchResults: [],
      isSearching: false,
      hasSearched: false,
      searchError: null,
      searchQuery: ''
    })
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useGitHubStore())

    expect(result.current.searchResults).toEqual([])
    expect(result.current.isSearching).toBe(false)
    expect(result.current.hasSearched).toBe(false)
    expect(result.current.searchError).toBe(null)
    expect(result.current.searchQuery).toBe('')
  })

  it('should update search query', () => {
    const { result } = renderHook(() => useGitHubStore())

    act(() => {
      result.current.setSearchQuery('react')
    })

    expect(result.current.searchQuery).toBe('react')
  })

  it('should search users successfully', async () => {
    const mockResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [mockUser]
    }

    mockGitHubApi.searchUsers.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useGitHubStore())

    await act(async () => {
      await result.current.searchUsers('testuser')
    })

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].user).toEqual(mockUser)
    expect(result.current.isSearching).toBe(false)
    expect(result.current.hasSearched).toBe(true)
  })

  it('should fetch repositories successfully', async () => {
    useGitHubStore.setState({
      searchResults: [{
        user: mockUser,
        repositories: [],
        loading: false,
        error: null
      }]
    })

    mockGitHubApi.getUserRepositories.mockResolvedValue([mockRepository])

    const { result } = renderHook(() => useGitHubStore())

    await act(async () => {
      await result.current.fetchUserRepositories('testuser')
    })

    expect(result.current.searchResults[0].repositories).toEqual([mockRepository])
    expect(result.current.searchResults[0].loading).toBe(false)
  })

  it('should reset store to initial state', () => {
    useGitHubStore.setState({
      searchResults: [{ user: mockUser, repositories: [], loading: false, error: null }],
      isSearching: true,
      hasSearched: true,
      searchError: 'Some error',
      searchQuery: 'test'
    })

    const { result } = renderHook(() => useGitHubStore())

    act(() => {
      result.current.reset()
    })

    expect(result.current.searchResults).toEqual([])
    expect(result.current.isSearching).toBe(false)
    expect(result.current.hasSearched).toBe(false)
    expect(result.current.searchError).toBe(null)
    expect(result.current.searchQuery).toBe('')
  })
})

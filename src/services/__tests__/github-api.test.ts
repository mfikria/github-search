import axios from 'axios'
import { mockAxiosInstance } from '../../__mocks__/axios'
import GitHubApiClient from '../github-api'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GitHubApiClient', () => {
  let apiClient: GitHubApiClient

  beforeEach(() => {
    jest.clearAllMocks()
    mockAxiosInstance.get.mockReset()
    apiClient = new GitHubApiClient()
  })

  it('should create axios instance with correct config', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'github-search-app'
      },
      timeout: 10000
    })
  })

  it('should search users successfully', async () => {
    const mockResponse = {
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [{ id: 1, login: 'testuser' }]
      }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)
    const result = await apiClient.searchUsers({ q: 'react' })

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/search/users?q=react&page=1&per_page=30')
    expect(result).toEqual(mockResponse.data)
  })

  it('should get user repositories successfully', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'repo1', full_name: 'testuser/repo1' }]
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)
    const result = await apiClient.getUserRepositories('testuser')

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/testuser/repos?page=1&per_page=30')
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'API Error'
    mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage))

    await expect(apiClient.searchUsers({ q: 'test' })).rejects.toThrow(errorMessage)
  })
})

const mockAxiosInstance = {
  get: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}

const mockAxios = {
  create: jest.fn(() => mockAxiosInstance)
}

export default mockAxios
export { mockAxiosInstance }

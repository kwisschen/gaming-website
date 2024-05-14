jest.mock("node-fetch");
const fetch = require("node-fetch");
const { fetchIGDBDataWithRetry } = require("./gatsby-node");

const mockFetchResponse = (ok, status, statusText, json) => {
  return {
    ok,
    status,
    statusText,
    json: () => Promise.resolve(json),
    text: () => Promise.resolve(JSON.stringify(json)),
  };
};

describe("fetchIGDBDataWithRetry", () => {
  beforeEach(() => {
    jest.resetModules(); // Clears any cache between tests
    fetch.mockClear();
  });

  it("should fetch data successfully from the IGDB API", async () => {
    // Mock token fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { access_token: "mocked_access_token" }));
    // Mock data fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { data: "some data" }));

    const response = await fetchIGDBDataWithRetry('genres', "fields name; limit 50;");

    expect(fetch).toHaveBeenCalledWith(
      "https://id.twitch.tv/oauth2/token",
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: expect.any(URLSearchParams),
      })
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.igdb.com/v4/genres",
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer mocked_access_token`,
        }),
        body: "fields name; limit 50;",
      })
    );

    expect(response).toEqual({ data: "some data" });
  });

  it("should retry fetching data on 429 status and eventually succeed", async () => {
    // Mock token fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { access_token: "mocked_access_token" }));
    // Mock data fetch with 429 status followed by a successful fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(false, 429, "Too Many Requests", { message: "Too Many Requests" }));
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { data: "some data after retry" }));

    const response = await fetchIGDBDataWithRetry('genres', "fields name; limit 50;", 2, 100);

    expect(fetch).toHaveBeenCalledTimes(3); // 1 for token, 2 for data fetch (1 retry)
    expect(response).toEqual({ data: "some data after retry" });
  });

  it("should throw an error after maximum retries on 429 status", async () => {
    // Mock token fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { access_token: "mocked_access_token" }));
    // Mock data fetch with 429 status
    fetch.mockResolvedValue(mockFetchResponse(false, 429, "Too Many Requests", { message: "Too Many Requests" }));

    await expect(fetchIGDBDataWithRetry('genres', "fields name; limit 50;", 2, 100))
      .rejects.toThrow("Failed after multiple retries.");

    expect(fetch).toHaveBeenCalledTimes(3); // 1 for token, 2 for data fetch (2 retries)
  });

  it("should throw an error when the response is not ok", async () => {
    // Mock token fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { access_token: "mocked_access_token" }));
    // Mock data fetch
    fetch.mockResolvedValueOnce(mockFetchResponse(false, 401, 'Unauthorized', { message: "Unauthorized" }));
  
    await expect(fetchIGDBDataWithRetry('genres', "fields name; limit 50;"))
      .rejects.toThrow("Failed to fetch from IGDB: 401 Unauthorized - {\"message\":\"Unauthorized\"}");
  });  

  it("should throw an error when token refresh fails", async () => {
    // Mock token fetch with failure
    fetch.mockResolvedValueOnce(mockFetchResponse(false, 400, "Bad Request", { message: "Bad Request" }));

    await expect(fetchIGDBDataWithRetry('genres', "fields name; limit 50;"))
      .rejects.toThrow("Failed to refresh token: Bad Request, Details: {\"message\":\"Bad Request\"}");
  });
});

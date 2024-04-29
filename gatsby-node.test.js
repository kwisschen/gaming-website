jest.mock("node-fetch");
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const fetch = require("node-fetch");
const { fetchIGDBData } = require("./gatsby-node");

// Adjusted mock fetch response to accurately simulate both success and failure
const mockFetchResponse = (ok, status, statusText, json) => {
  return {
    ok,
    status, // Check if correctly simulated
    statusText,
    json: () => Promise.resolve(json), // Simulate JSON response for success
    text: () => Promise.resolve(JSON.stringify(json)), // Simulate text response for failure
  };
};

describe("fetchIGDBData", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch data successfully from the IGDB API", async () => {
    fetch.mockResolvedValueOnce(mockFetchResponse(true, 200, "OK", { data: "some data" }));

    const response = await fetchIGDBData('genres', "fields name; limit 50;");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.igdb.com/v4/genres",
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
        body: "fields name; limit 50;",
      }),
    );
    expect(response).toEqual({ data: "some data" });
  });

  it("should throw an error when the response is not ok", async () => {
    // Simulate a failed fetch operation
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ message: "Failed to fetch" }),
      text: () => Promise.resolve("Unauthorized"), // Matches API's actual failed response text
    });
  
    await expect(fetchIGDBData('genres', "fields name; limit 50;"))
      .rejects.toThrow("Failed to fetch from IGDB: 401 Unauthorized - Unauthorized");
  });
});

import { Test } from "@nestjs/testing";
import { YouTubeService } from "./youtube.service";
import * as nock from "nock";
import { InternalServerErrorException } from "@nestjs/common";

describe("YouTubeService (integration)", () => {
  let service: YouTubeService;
  const BASE_URL = process.env.YOUTUBE_BASE_URL || "https://www.googleapis.com";
  const API_ENDPOINT = process.env.YOUTUBE_API_ENDPOINT || "/youtube/v3/search";

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [YouTubeService],
    }).compile();

    service = moduleRef.get(YouTubeService);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe("Successful API responses", () => {
    it("should return videoId when YouTube API returns result", async () => {
      const expectedVideoId = "YoHD9XEInc0";
      const movieTitle = "Inception";

      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .reply(200, {
          items: [
            {
              id: { videoId: expectedVideoId },
              snippet: {
                title: "Inception Official Trailer",
                description: "Official trailer",
              },
            },
          ],
        });

      const videoId = await service.fetchTrailer(movieTitle);
      expect(videoId).toBe(expectedVideoId);
    });
  });

  describe("Empty results", () => {
    it("should return null when YouTube API returns no results", async () => {
      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .reply(200, {
          items: [],
          pageInfo: {
            totalResults: 0,
            resultsPerPage: 1,
          },
        });

      const videoId = await service.fetchTrailer("Unknown Movie");
      expect(videoId).toBeNull();
    });

    it("should return null when items is undefined", async () => {
      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .reply(200, {
          pageInfo: {
            totalResults: 0,
            resultsPerPage: 1,
          },
        });

      const videoId = await service.fetchTrailer("Test Movie");
      expect(videoId).toBeNull();
    });
  });

  describe("Error handling", () => {
    it("should throw InternalServerErrorException on 500 API failure", async () => {
      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .reply(500, {
          error: {
            code: 500,
            message: "Internal Server Error",
          },
        });

      await expect(service.fetchTrailer("Fails")).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it("should handle 403 Forbidden (quota exceeded)", async () => {
      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .reply(403, {
          error: {
            code: 403,
            message:
              "The request cannot be completed because you have exceeded your quota.",
          },
        });

      await expect(service.fetchTrailer("Test")).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle empty movie title", async () => {
      try {
        await service.fetchTrailer("");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it("should handle very long movie titles", async () => {
      const longTitle = "A".repeat(1000);

      nock(BASE_URL).get(API_ENDPOINT).query(true).reply(200, { items: [] });

      const result = await service.fetchTrailer(longTitle);
      expect(result).toBeNull();
    });

    it("should handle concurrent requests", async () => {
      nock(BASE_URL)
        .get(API_ENDPOINT)
        .query(true)
        .times(3)
        .reply(200, {
          items: [{ id: { videoId: "concurrent123" } }],
        });

      const promises = [
        service.fetchTrailer("Movie 1"),
        service.fetchTrailer("Movie 2"),
        service.fetchTrailer("Movie 3"),
      ];

      const results = await Promise.all(promises);
      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toBe("concurrent123");
      });
    });
  });
});

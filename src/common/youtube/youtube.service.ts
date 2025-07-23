import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import { LoggerService } from "@utils";

@Injectable()
export class YouTubeService {
  private readonly API_KEY = process.env.YOUTUBE_API_KEY;
  private readonly BASE_URL =
    process.env.YOUTUBE_BASE_URL || "https://www.googleapis.com";
  private readonly API_ENDPOINT =
    process.env.YOUTUBE_API_ENDPOINT || "/youtube/v3/search";

  async fetchTrailer(movieTitle: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.BASE_URL}${this.API_ENDPOINT}`, {
        params: {
          part: "snippet",
          q: `${movieTitle} trailer`,
          type: "video",
          maxResults: 1,
          key: this.API_KEY,
        },
      });

      const items = response.data.items;
      if (items && items.length > 0) {
        LoggerService.log(
          YouTubeService.name,
          `Found trailer for ${movieTitle}: ${items[0].id.videoId}`,
        );
        return items[0].id.videoId;
      }

      return null;
    } catch (err) {
      LoggerService.error(
        YouTubeService.name,
        `Failed to fetch trailer for ${movieTitle}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        "Failed to fetch trailer from YouTube",
      );
    }
  }
}

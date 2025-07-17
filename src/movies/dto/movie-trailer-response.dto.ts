import { ApiProperty } from "@nestjs/swagger";

export class MovieTrailerResponseDto {
  @ApiProperty({
    description: "YouTube video ID of the movie trailer",
    example: "SUXWAEX2jlg",
    required: false,
    type: String,
  })
  videoId: string;
}

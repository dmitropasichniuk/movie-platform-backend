import { ApiProperty } from "@nestjs/swagger";

export class DefaultResponseDto<T = any> {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: "Successful response",
  })
  message: string;

  @ApiProperty({
    description: "Main response payload",
  })
  data: T;
}

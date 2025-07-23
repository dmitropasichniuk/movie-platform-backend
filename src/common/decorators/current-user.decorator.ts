import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserResponseDto } from "@users";

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserResponseDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

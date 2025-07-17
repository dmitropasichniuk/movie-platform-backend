import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";

import { UserEntity } from "@users";
import { UserRole } from "@enums";

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user: Partial<UserEntity> = request.user;
    const paramId = request.params.id;

    if (!user) throw new ForbiddenException("User not authenticated");
    if (user.role === UserRole.ADMIN) return true;
    if (user.id === paramId) return true;

    throw new ForbiddenException("Access denied");
  }
}

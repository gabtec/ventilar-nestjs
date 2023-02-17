import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Option here was: roles defined at controller level
    // and roles defined at route level,
    // will be merged, not overrided
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // route NOT protected by any role ---> proceed
    if (!roles) return true;

    // route PROTECTED by role(s) ---> check with user.role
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (roles.includes(user.role)) return true;

    return false;
  }
}

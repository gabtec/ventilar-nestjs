import { SetMetadata } from '@nestjs/common';

export const AllowRoles = function (...roles: string[]) {
  return SetMetadata('roles', roles);
};

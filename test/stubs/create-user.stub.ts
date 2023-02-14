import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export const createUserStub = function (): CreateUserDto {
  return {
    name: 'Admin for Tests',
    mec: 9999,
    password: 'test',
    password_confirm: 'test',
    workplace_id: null,
  };
};

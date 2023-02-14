import { CreateWardDto } from 'src/wards/dtos/create-ward.dto';

export const createWardStub = function (): CreateWardDto {
  return { name: 'TST_Service', institution: 'TST' };
};

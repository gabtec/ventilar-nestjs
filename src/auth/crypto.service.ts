import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  async hashPassword(password: string) {
    console.log('crypto call ' + password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async comparePassword(password, password_hash): Promise<boolean> {
    return await bcrypt.compare(password, password_hash);
  }
}

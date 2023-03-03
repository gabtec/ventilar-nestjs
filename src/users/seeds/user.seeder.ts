import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../entities/user.entity';

import * as argon2 from 'argon2';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);

    const hash = await argon2.hash('secret');

    const users = [
      {
        name: 'John Admin',
        mec: 9999,
        role: 'admin',
        // pass = secret
        password_hash: hash,
      },
      {
        name: 'Gil Dispatcher',
        mec: 1000,
        role: 'dispatcher',
        workplace_id: 1,
        // pass = secret
        password_hash: hash,
      },
      {
        name: 'Maria Consumer',
        mec: 2000,
        role: 'consumer',
        workplace_id: 2,
        // pass = secret
        password_hash: hash,
      },
    ];

    // SOS: check if seed already exists, if NOT, insert it
    await repository.insert(users);
  }
}

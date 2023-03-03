import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Ward } from '../entities/ward.entity';

export default class WardSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Ward);

    const wards = [
      {
        name: 'HDP_Urgência',
        institution: 'HDP',
        is_park: true,
      },
      {
        name: 'HDP_Medicina',
        institution: 'HDP',
        is_park: false,
      },
      {
        name: 'HSA_Intensiva',
        institution: 'HSA',
        is_park: true,
      },
    ];

    // SOS: check if seed already exists, if NOT, insert it
    await repository.insert(wards);
  }
}

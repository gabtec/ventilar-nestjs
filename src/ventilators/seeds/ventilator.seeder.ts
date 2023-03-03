import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Ventilator } from '../entities/ventilator.entity';

export default class VentilatorSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Ventilator);

    const ventilators = [
      {
        brand: 'Philips',
        model: 'Trilogy',
        serial: '3000-AWX',
        category: 'VNI',
        park_id: 1,
      },
      {
        brand: 'Oxylog',
        model: 'Life',
        serial: 'PUT665TR',
        category: 'VNI',
        park_id: 1,
      },
      {
        brand: 'Philips',
        model: 'Trilogy',
        serial: '3000-ZZTY',
        category: 'VNI',
        park_id: 3,
      },
      {
        brand: 'Medtronic',
        model: 'Assist',
        serial: 'KH8765434H',
        category: 'VI',
        park_id: 3,
      },
    ];

    // SOS: check if seed already exists, if NOT, insert it
    await repository.insert(ventilators as any);
  }
}

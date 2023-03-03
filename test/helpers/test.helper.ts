// import { AppDataSource } from 'db/data-source';

// export async function clearDB(table) {
//   return await AppDataSource.manager.clear(table);
// }

export async function truncateTable(table, repository) {
  return await repository.query(`TRUNCATE ${table} RESTART IDENTITY CASCADE;`);
}

// Font:
// https://github.com/ToolJet/ToolJet/blob/develop/server/test/test.helper.ts
// https://blog.tooljet.com/clearing-tables-before-each-test-nestjs-typeorm/

// export async function clearDB() {
//   const entities = getConnection().entityMetadatas;
//   for (const entity of entities) {
//     const repository = getConnection().getRepository(entity.name);
//     await repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`);
//   }
// }

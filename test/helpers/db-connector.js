const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'admin',
  password: 'admin',
  database: 'ventilar_db_test',
});

async function init() {
  await client.connect();

  const gabrielPassw =
    '$2y$10$mYdxBEDLAmMRhF6NPRy2OedSW2EboPipojt/d4jZj.wl12AJe8XoO';

  // const res = await client.query('SELECT $1::text as message', ['Hello world!']);
  const res = await client.query(
    `INSERT INTO t_users (name, mec, role, password_hash, workplace_id) 
  VALUES ('Gabriel Martins', 2222, 'dispatcher',$1::text, 1);`,
    [gabrielPassw],
  );
  console.log(res.rows); // Hello world!
  await client.end();
}
init();

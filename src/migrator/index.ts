import 'dotenv/config';

import { Pool } from 'pg';
import { DbService } from '../services/db';
import { MigratorV1 } from './v1';

const MIGRATORS = [MigratorV1];
const CURRENT_MODEL_VERSION = 1;

async function runMigration(dbService: DbService, startFrom = 1) {
  const targetMigrators = MIGRATORS.filter((m) => m.version >= startFrom);

  for (const m of targetMigrators) {
    console.log(`Migration Version ${m.version} start!`);
    await new m(dbService).up();
    console.log(`Migration Version ${m.version} end!`);
  }
}

(async () => {
  console.log('--------Migration Start---------');

  const migrationStartFrom = parseInt(
    process.argv[2] ?? CURRENT_MODEL_VERSION + 1,
  );

  if (isNaN(migrationStartFrom))
    throw Error('Migration Version 숫자를 입력하세요');

  console.log('Migration Starts from version ' + migrationStartFrom);

  console.log('Create DB pool');
  const pool = new Pool({
    host: process.env.SUPABASE_HOST_URL ?? '',
    database: 'postgres',
    port: 5432,
    user: 'postgres',
    password: process.env.SUPABASE_DB_PW ?? '',
    max: 5,
  });

  const db = new DbService(pool);

  await runMigration(db, migrationStartFrom);

  console.log('--------Migration End---------');
})();

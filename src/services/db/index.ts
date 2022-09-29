import { Pool, PoolClient } from 'pg';

export class DbService {
  private _pool: Pool;

  constructor(pool: Pool) {
    this._pool = pool;
  }

  private async _getClient(): Promise<PoolClient> {
    return await this._pool.connect();
  }

  public async run(query: string) {
    const client = await this._getClient();

    try {
      await client.query(query);
    } catch (e) {
      console.error('query run error', e);
    } finally {
      client.release();
    }
  }
}

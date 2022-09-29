import { DbService } from '../services/db';

export abstract class Migrator {
  protected _dbService: DbService;

  constructor(dbService: DbService) {
    this._dbService = dbService;
  }

  abstract up(): void;

  public async runQuery(query: string) {
    await this._dbService.run(query);
  }
}

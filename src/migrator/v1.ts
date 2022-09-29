import { QueryBuilder } from '../services/query';
import { Collection } from '../types';
import { Migrator } from './types';

const SnkrzCollection: Collection = {
  tokenAddress: '0x24E81610738B2E547E5d3b4Ee15c74019E285bca',
  name: 'SNKRZ',
  slug: 'snkrz',
  webUrl: 'http://www.thesnkrz.com/',
  twitterUrl: 'https://www.twitter.com/theSNKRZ',
  discordUrl: 'https://discord.gg/thesnkrz',
};

export class MigratorV1 extends Migrator {
  public static version: number = 1;

  public async up() {
    await this._createSnkrzCollectionTable();
    await this._createSnkrzView();
  }

  private async _createSnkrzCollectionTable() {
    const snkrzBuildQuery = QueryBuilder.buildInsertQuery(
      'collections',
      SnkrzCollection,
    );

    await this.runQuery(snkrzBuildQuery);
  }

  private async _createSnkrzView() {
    const snkrzBuildQuery = QueryBuilder.buildCreateViewQuery(
      SnkrzCollection.name,
      'snkrz_nft_infos',
    );

    await this.runQuery(snkrzBuildQuery);
  }
}

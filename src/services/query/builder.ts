import dedent from 'ts-dedent';
import { Args } from '../../types';
import { QueryParams } from './utils';

export class QueryBuilder {
  private static _convertArgmentsToParmasAndValues(
    args: Object,
  ): [params: string, values: string] {
    return QueryParams.parse(args).toString();
  }

  static buildInsertQuery(table: string, args: Args) {
    const [params, values] = this._convertArgmentsToParmasAndValues(args);

    return dedent`
      INSERT INTO ${table}
      (${params})
      VALUES
      (${values})
    `;
  }

  static buildCreateViewQuery(
    collectionName: string,
    collectionTable: string,
  ): string {
    return dedent`
      CREATE OR REPLACE VIEW ${collectionName.toLowerCase()}_view
      AS (
	      WITH 
          latest_rents AS (
            SELECT
              rents.lend_id as lend_id,
              max(rents.end_at) as end_at
            FROM
              rents
            WHERE
              rents.tx_status != 'Canceled'
            GROUP BY
              rents.lend_id
          ),

          lends_in_collection AS (
            SELECT
              lends.*
            FROM
              lends as lends
            WHERE
              lends.collection_id = (SELECT c.id FROM collections AS c WHERE c.name = 'SNKRZ') AND
              lends.tx_status != 'Canceled'
          ),

          lends_with_latest_rents AS (
            SELECT
              lends.*,
              latest_rents.end_at as end_at
            FROM lends_in_collection as lends
            LEFT JOIN latest_rents ON lends.id = latest_rents.lend_id
          )
          
          SELECT
            ${collectionTable}.*,
            l.payment,
            l.payment_option,
            l.payment_token_address,
            l.valid_until,
            l.min_rent_duration,
            l.max_rent_duration,
            l.end_at,
            l.tx_hash
          FROM lends_with_latest_rents as l LEFT JOIN ${collectionTable}
          ON ${collectionTable}.token_uid = l.token_id
        )
    `;
  }
}

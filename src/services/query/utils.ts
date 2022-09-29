export class QueryParams {
  private _keys: string[];
  private _values: string[];

  private constructor(keys: string[], values: string[]) {
    this._keys = keys;
    this._values = values;
  }

  static parse(args: Object): QueryParams {
    const filteredEntries = Object.entries(args).filter(
      ([k, v]) => v !== null && v !== undefined,
    );
    const newArgs = Object.fromEntries(filteredEntries);

    return new QueryParams(
      [...Object.keys(newArgs)],
      [...Object.values(newArgs)],
    );
  }

  public toString(): [string, string] {
    return [this._keysToString(), this._valuesToString()];
  }

  private _keysToString() {
    return this._keys.map((k) => this._camelToSnake(k)).join(',');
  }

  private _camelToSnake(camelCaseString: string): string {
    return camelCaseString.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );
  }

  private _valuesToString() {
    return this._values
      .map((v) => {
        if (typeof v === 'string') return `'${v}'`;
        if (typeof v === 'bigint') return Number(v);
        return v;
      })
      .join(',');
  }
}

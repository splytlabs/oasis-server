import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env.production') });
} else if (process.env.NODE_ENV === 'develop') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
} else {
  // throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

type CastType = {
  number: number;
  string: string;
};

function number(value: string): number {
  const result = Number(value);
  if (!Number.isNaN(result)) {
    return result;
  } else {
    throw new Error(`Cannot cast ${value} to number`);
  }
}

function string(value: string) {
  return value;
}

const typeConverter = { number, string };

function cast<T extends keyof CastType>(
  key: string,
  type: T,
  defaultValue: CastType[T],
): CastType[T] {
  const value = process.env[key];
  if (value !== undefined) {
    try {
      return typeConverter[type](value) as CastType[T];
    } catch (e) {
      throw new Error(`process.env.${key}에 적절한 값을 설정하지 않았습니다`);
    }
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`process.env.${key}에 할당할 값이 없습니다`);
}

export const config = {
  dbHost: cast('DB_HOST', 'string', 'localhost'),
  dbPort: cast('DB_PORT', 'number', 6519),
  dbUser: cast('DB_NAME', 'string', 'admin'),
  dbPassword: cast('DB_PASSWORD', 'string', 'admin1234'),
  databaseName: cast('DB_NAME', 'string', 'postgres'),
  dbPoolCount: cast('DB_POOL_COUNT', 'number', 5),
  klayRpcUrl: cast(
    'KLAYTN_RPC_URL',
    'string',
    'https://api.baobab.klaytn.net:8651',
  ),
};

interface DatabaseConfigProps {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  schema: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface RedisConfigProps {
  host: string;
  port: number;
  url?: string;
};

export interface ConfigProps {
  port: number;
  database: DatabaseConfigProps;
  whitelist: string;
  tokens: Tokens;
  redis: RedisConfigProps
  environment?: string;
  isProduction?: boolean;
}

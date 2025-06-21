interface DatabaseConfigProps {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

export interface ConfigProps {
  port: number;
  database: DatabaseConfigProps;
  whitelist: string;
  tokens: Tokens;
}

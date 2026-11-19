import fs from 'fs';
import path from 'path';

export interface EnvConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  bookingApiUrl: string;
  shopUrl: string;
}

const envName = process.env.TEST_ENV ?? 'dev';
const file = path.resolve(__dirname, 'environments', `${envName}.json`);

if (!fs.existsSync(file)) {
  const available = fs
    .readdirSync(path.dirname(file))
    .map((f) => f.replace(/\.json$/, ''))
    .join(', ');
  throw new Error(`Unknown TEST_ENV "${envName}". Available: ${available}`);
}

/** Active environment config, selected via the TEST_ENV variable (default: dev). */
export const env: EnvConfig = JSON.parse(fs.readFileSync(file, 'utf-8'));

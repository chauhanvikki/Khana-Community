import Redis from 'ioredis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  redis.on('connect', () => console.log('✅ Redis Connected'));
  redis.on('error', (err) => console.warn('⚠️ Redis Error:', err.message));
} else {
  console.warn('⚠️ REDIS_URL not set — caching disabled');
}

export default redis;

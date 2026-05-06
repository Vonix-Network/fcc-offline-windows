// Override ALL datasources unconditionally (loaded last by LoopBack boot)
// This ensures PostgreSQL is used regardless of NODE_ENV quirks
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  console.log('>>> datasources.local.js overriding db to postgresql');
  module.exports = {
    db: {
      name: 'db',
      connector: 'postgresql',
      url: process.env.DATABASE_URL || null,
      host: process.env.PGHOST || '127.0.0.1',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'vonix_code_camp',
      user: process.env.PGUSER || 'vonix',
      password: process.env.PGPASSWORD || '',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
    },
    mail: {
      name: 'mail',
      connector: 'mail',
      transport: {
        type: 'smtp',
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      }
    }
  };
} else {
  module.exports = {};
}

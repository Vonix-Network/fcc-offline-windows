// Production datasources — MongoDB + SMTP
// Loaded automatically by LoopBack when NODE_ENV=production
module.exports = {
  db: {
    name: 'db',
    connector: 'mongodb',
    url: process.env.MONGODB || 'mongodb://localhost/vonix_code_camp'
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

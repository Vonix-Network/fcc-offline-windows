module.exports = {
  apps: [
    {
      name: 'vonix-code-camp',
      script: 'server/production-start.js',
      cwd: '/var/www/vonix-code-camp',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
        // Secrets are loaded from /var/www/vonix-code-camp/.env via dotenv
      }
    }
  ]
};

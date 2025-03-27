const { Pool } = require('pg');
const { parse } = require('pg-connection-string');

const config = parse(process.env.DATABASE_URL);
config.ssl = { rejectUnauthorized: false };
config.max = Number(process.env.POOL_SIZE) || 10;
config.connectionTimeoutMillis = Number(process.env.CONNECTION_TIMEOUT) * 1000 || 10000;

const pool = new Pool(config);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Set timeout for queries
    client.query = (...args) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Query timeout exceeded'));
        }, config.connectionTimeoutMillis);

        query.apply(client, args)
          .then(resolve, reject)
          .finally(() => clearTimeout(timeout));
      });
    };

    client.release = () => {
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  }
};
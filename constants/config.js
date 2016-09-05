const port = 3000;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

const config = {
  port: port,
  host: host,
  hostAddress: process.env.WEBSITE_ADDRESS || `http://${host}`,
  crypto : '',
  dbHost : 'mongodb://localhost:27017/xxxxx',
  masterAdminPassword : '',
  masterAdminUsername : '',
};

module.exports = config;

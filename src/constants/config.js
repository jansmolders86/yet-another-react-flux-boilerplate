const port = process.env.PORT || 1337;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

const config = {
  port: port,
  host: host,
  hostAddress: process.env.WEBSITE_ADDRESS || `http://${host}`,
  databaseDsn : process.env.DB || 'mysql://myapp:myapp@localhost/myapp',
  crypto : '---- place here ----',
  GOOGLE_CLIENT_ID : '---- place here ----',
  GOOGLE_CLIENT_SECRET : '---- place here ----',
  FACEBOOK_APP_ID : '---- place here ----',
  FACEBOOK_APP_SECRET : '---- place here ----',
  TWITTER_CONSUMER_KEY : '---- place here ----',
  TWITTER_CONSUMER_SECRET : '---- place here ----',
  dbHost : 'mongodb://localhost:27017/top10'
};

module.exports = config;

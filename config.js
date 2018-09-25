
const config = {};

config.db_settings = {
  host: 'localhost',
  user: 'bdp_bdpage',
  password: 'eastcedar',
  database: 'rockcms',
};

config.port = process.env.PORT || 3000;
config.bento_api_port = process.env.PORT || 4000;
config.rabbit_prod = 'amqp://guest:guest@localhost:5672';
config.rabbit_exchange = 'todaycmscontent';
config.asset_paths = {
  '/assets': '/assets',
  '/theme': '/theme',
  '/views': '/views',
  '/public': '/public',
  '/node_modules': '/node_modules'
}

config.queryRecLen = 20;
config.local = false;

// var rabbit_prod = 'amqp://guest:guest@54.213.145.97:8080';
// var rabbit_exchange = 'sys02newscmscontent';


/*
config.redis = {};
config.web = {};

config.default_stuff = ['red','green','blue','apple','yellow','orange','politics'];
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password= process.env.TWITTER_PASSWORD || 'password';
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;
*/

// List of valid publisher codes.
config.rcmsPublishers = {
  nc: 'nbcnews',
  td: 'today',
  ms: 'msnbc',
};

// List of valid content type codes.
config.rcmsContentTypes = {
  na: 'Article',
  sl: 'Slideshow',
  rp: 'Recipe',
};

config.bentoApiEndpoint = 'https://staging.newsdigitalapi.com';


module.exports = config;

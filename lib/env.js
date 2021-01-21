const { logger } = require('./output')

function read(key) {
  if (!process.env[key]) {
    logger.fatal(`Missing environment variable ${key}`);
    process.exit(1);
  }
  return process.env[key];
}

function assert(key) {
  read(key);
}

module.exports = { read, assert };

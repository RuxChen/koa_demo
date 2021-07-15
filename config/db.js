const mongoose = require('mongoose')
const config = require('./index')
const logger = require('../utils/loggers');

mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', () => {
  logger.error('*** error ***')
})

db.on('open', () => {
  logger.info('*** open ***')
})

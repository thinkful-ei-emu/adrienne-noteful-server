module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://admin@localhost/noteful',
  DB_TEST_URL: process.env.DB_TEST_URL || 'postgresql://admin@localhost/noteful_test'
};
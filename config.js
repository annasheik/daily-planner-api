exports.CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/daily-planner-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-daily-planner-app';
exports.PORT = process.env.PORT || 3000;
